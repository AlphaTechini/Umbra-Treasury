<script lang="ts">
	import { createTransaction } from '$lib/api/transactions';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import UmbraStatusPanel from '$lib/components/UmbraStatusPanel.svelte';
	import { formatDateTime } from '$lib/display';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { daoSession, requireActiveUmbraSession, signWalletAuthorization, walletSession } from '$lib/session';
	import {
		depositIntoEncryptedBalance,
		queryEncryptedBalances,
		withdrawFromEncryptedBalance
	} from '$lib/umbra';
	import { toasts } from '$lib/toasts';
	import { get } from 'svelte/store';

	type OperationStatus = 'idle' | 'pending' | 'ready' | 'error';

	let destinationAddress = $state('');
	let mintAddress = $state('');
	let amountBaseUnits = $state('');
	let amountHint = $state('');
	let tokenSymbol = $state('usdc');
	let queryMintAddresses = $state('');
	let queryResult = $state('No encrypted balance query has run yet.');
	let operationStatus = $state<OperationStatus>('idle');
	let operationTitle = $state('Umbra client ready');
	let operationDetail = $state('Connect a wallet, then run encrypted balance operations from this page.');
	let operationReference = $state('');

	const depositAction = 'umbra:deposit';
	const queryAction = 'umbra:query';
	const withdrawAction = 'umbra:withdraw';

	async function handleDeposit(event: SubmitEvent) {
		event.preventDefault();
		await runRequestAction(depositAction, async () => {
			const context = await requireTreasuryContext();
			const amount = parseBaseUnits(amountBaseUnits);
			operationStatus = 'pending';
			operationTitle = 'Depositing into encrypted balance';
			operationDetail = 'Your browser wallet is signing and submitting the Umbra deposit transaction.';
			operationReference = '';

			const result = await depositIntoEncryptedBalance(context.umbraSession, {
				destinationAddress: destinationAddress.trim() || context.walletAddress,
				mintAddress: mintAddress.trim(),
				amountBaseUnits: amount
			});
			const refs = getUmbraOperationRefs(result, {
				source: 'frontend_real_umbra_deposit',
				mintAddress: mintAddress.trim(),
				destinationAddress: destinationAddress.trim() || context.walletAddress
			});
			const walletAuthorization = await signWalletAuthorization({
				action: 'treasury_transaction:create',
				daoId: context.dao.id,
				walletAddress: context.walletAddress
			});

			await createTransaction(context.dao.id, {
				createdByWalletAddress: context.walletAddress,
				walletAuthorization,
				type: 'income',
				category: 'treasury_transfer',
				token: tokenSymbol.trim() || 'usdc',
				amountHint: amountHint.trim() || amount.toString(),
				date: new Date().toISOString(),
				umbraOperationType: 'deposit',
				umbraOperationRefs: refs
			});

			operationStatus = 'ready';
			operationTitle = 'Encrypted deposit recorded';
			operationDetail = 'The Umbra deposit was submitted and a public-safe treasury reference was recorded.';
			operationReference = getPrimaryReference(refs);
			toasts.add('Encrypted balance deposit submitted and recorded.', 'success');
		});
	}

	async function handleQuery(event: SubmitEvent) {
		event.preventDefault();
		await runRequestAction(queryAction, async () => {
			const umbraSession = await requireActiveUmbraSession();
			const mints = queryMintAddresses
				.split(',')
				.map((value) => value.trim())
				.filter(Boolean);

			if (mints.length === 0) {
				throw new Error('Enter at least one mint address to query.');
			}

			operationStatus = 'pending';
			operationTitle = 'Querying encrypted balances';
			operationDetail = 'The balance query runs in the browser and is not sent to the backend.';
			operationReference = '';

			const balances = await queryEncryptedBalances(umbraSession, { mintAddresses: mints });
			queryResult = JSON.stringify(serializeForDisplay(Object.fromEntries(balances)), null, 2);
			operationStatus = 'ready';
			operationTitle = 'Encrypted balances queried';
			operationDetail = `Queried ${balances.size} mint${balances.size === 1 ? '' : 's'} at ${formatDateTime(new Date().toISOString())}.`;
			toasts.add('Encrypted balance query completed in the browser.', 'success');
		});
	}

	async function handleWithdraw(event: SubmitEvent) {
		event.preventDefault();
		await runRequestAction(withdrawAction, async () => {
			const context = await requireTreasuryContext();
			const amount = parseBaseUnits(amountBaseUnits);
			operationStatus = 'pending';
			operationTitle = 'Withdrawing from encrypted balance';
			operationDetail = 'Your browser wallet is signing and submitting the Umbra withdrawal transaction.';
			operationReference = '';

			const result = await withdrawFromEncryptedBalance(context.umbraSession, {
				destinationAddress: destinationAddress.trim() || context.walletAddress,
				mintAddress: mintAddress.trim(),
				amountBaseUnits: amount
			});
			const refs = getUmbraOperationRefs(result, {
				source: 'frontend_real_umbra_withdraw',
				mintAddress: mintAddress.trim(),
				destinationAddress: destinationAddress.trim() || context.walletAddress
			});
			const walletAuthorization = await signWalletAuthorization({
				action: 'treasury_transaction:create',
				daoId: context.dao.id,
				walletAddress: context.walletAddress
			});

			await createTransaction(context.dao.id, {
				createdByWalletAddress: context.walletAddress,
				walletAuthorization,
				type: 'expense',
				category: 'treasury_transfer',
				token: tokenSymbol.trim() || 'usdc',
				amountHint: amountHint.trim() || amount.toString(),
				date: new Date().toISOString(),
				umbraOperationType: 'withdraw',
				umbraOperationRefs: refs
			});

			operationStatus = 'ready';
			operationTitle = 'Encrypted withdrawal recorded';
			operationDetail = 'The Umbra withdrawal was submitted and a public-safe treasury reference was recorded.';
			operationReference = getPrimaryReference(refs);
			toasts.add('Encrypted balance withdrawal submitted and recorded.', 'success');
		});
	}

	async function requireTreasuryContext() {
		const umbraSession = await requireActiveUmbraSession();
		const dao = get(daoSession).dao;
		const walletAddress = get(walletSession).walletAddress;

		if (!dao || !walletAddress) {
			throw new Error('Connect a wallet and load its DAO before recording Umbra operations.');
		}

		if (!mintAddress.trim()) {
			throw new Error('Mint address is required for Umbra encrypted balance operations.');
		}

		return { dao, walletAddress, umbraSession };
	}

	function parseBaseUnits(value: string) {
		const normalized = value.trim();

		if (!/^[1-9]\d*$/.test(normalized)) {
			throw new Error('Amount must be a positive integer in token base units.');
		}

		return BigInt(normalized);
	}

	function getUmbraOperationRefs(result: unknown, extra: Record<string, unknown>) {
		const references = extractReferenceStrings(result);

		return {
			...extra,
			resultType: getResultType(result),
			signatures: references.signatures,
			transactionReferences: references.transactionReferences
		};
	}

	function extractReferenceStrings(value: unknown) {
		const signatures = new Set<string>();
		const transactionReferences = new Set<string>();

		function visit(nextValue: unknown, key = '') {
			if (typeof nextValue === 'string') {
				const lowerKey = key.toLowerCase();
				if (lowerKey.includes('signature')) {
					signatures.add(nextValue);
				}
				if (lowerKey.includes('transaction') || lowerKey.includes('signature')) {
					transactionReferences.add(nextValue);
				}
				return;
			}

			if (Array.isArray(nextValue)) {
				nextValue.forEach((item) => visit(item, key));
				return;
			}

			if (nextValue && typeof nextValue === 'object') {
				for (const [childKey, childValue] of Object.entries(nextValue)) {
					visit(childValue, childKey);
				}
			}
		}

		visit(value);

		return {
			signatures: Array.from(signatures),
			transactionReferences: Array.from(transactionReferences)
		};
	}

	function getResultType(result: unknown) {
		if (Array.isArray(result)) {
			return 'array';
		}

		if (result && typeof result === 'object') {
			return result.constructor.name;
		}

		return typeof result;
	}

	function getPrimaryReference(refs: Record<string, unknown>) {
		const signatures = Array.isArray(refs.signatures) ? refs.signatures : [];
		const transactions = Array.isArray(refs.transactionReferences) ? refs.transactionReferences : [];
		return String(signatures[0] ?? transactions[0] ?? refs.resultType ?? 'Umbra operation submitted');
	}

	function serializeForDisplay(value: unknown): unknown {
		if (typeof value === 'bigint') {
			return value.toString();
		}

		if (value instanceof Map) {
			return Object.fromEntries(value);
		}

		if (value instanceof Uint8Array) {
			return `0x${Array.from(value)
				.map((byte) => byte.toString(16).padStart(2, '0'))
				.join('')}`;
		}

		if (Array.isArray(value)) {
			return value.map(serializeForDisplay);
		}

		if (value && typeof value === 'object') {
			return Object.fromEntries(
				Object.entries(value).map(([key, nextValue]) => [key, serializeForDisplay(nextValue)])
			);
		}

		return value;
	}
</script>

<svelte:head>
	<title>Real Umbra Operations - Umbra Treasury</title>
	<meta name="description" content="Run real Umbra encrypted balance deposit, query, and withdrawal operations." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div>
				<h1 class="font-h3 text-h3 text-white">Real Umbra Operations</h1>
			</div>
			<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
				Connect Wallet
			</a>
		</header>

		<main class="flex-1 overflow-y-auto p-6 space-y-6">
			<UmbraStatusPanel status={operationStatus} title={operationTitle} detail={operationDetail} reference={operationReference} />

			<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
				<form class="bg-[#18181b] border border-[#27272a] rounded-lg p-6 space-y-5" onsubmit={handleDeposit}>
					<div>
						<h2 class="font-h3 text-h3 text-white">Deposit Or Withdraw</h2>
						<p class="text-sm text-zinc-400 mt-1">Moves public token balance into or out of an Umbra encrypted balance.</p>
					</div>

					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-400">
						Mint Address
						<input bind:value={mintAddress} class="bg-[#0d0e15] border border-[#3f3f46] rounded-lg px-3 py-2 text-sm normal-case text-zinc-100 placeholder:text-zinc-600" placeholder="Token mint address" />
					</label>

					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-400">
						Destination Address
						<input bind:value={destinationAddress} class="bg-[#0d0e15] border border-[#3f3f46] rounded-lg px-3 py-2 text-sm normal-case text-zinc-100 placeholder:text-zinc-600" placeholder="Defaults to connected wallet" />
					</label>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-400">
							Amount Base Units
							<input bind:value={amountBaseUnits} inputmode="numeric" class="bg-[#0d0e15] border border-[#3f3f46] rounded-lg px-3 py-2 text-sm normal-case text-zinc-100 placeholder:text-zinc-600" placeholder="1000000" />
						</label>
						<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-400">
							Token Symbol
							<input bind:value={tokenSymbol} class="bg-[#0d0e15] border border-[#3f3f46] rounded-lg px-3 py-2 text-sm normal-case text-zinc-100 placeholder:text-zinc-600" placeholder="usdc" />
						</label>
					</div>

					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-400">
						Public Amount Hint
						<input bind:value={amountHint} class="bg-[#0d0e15] border border-[#3f3f46] rounded-lg px-3 py-2 text-sm normal-case text-zinc-100 placeholder:text-zinc-600" placeholder="Optional public-safe amount hint" />
					</label>

					<div class="flex flex-col sm:flex-row gap-3">
						<button
							type="submit"
							disabled={$pendingRequestActions[depositAction]}
							class="flex-1 bg-[#10b981] text-[#002113] font-bold py-3 rounded-lg text-sm hover:bg-[#4edea3] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
						>
							{$pendingRequestActions[depositAction] ? 'Depositing...' : 'Deposit Encrypted Balance'}
						</button>
						<button
							type="button"
							onclick={(event) => handleWithdraw(event as unknown as SubmitEvent)}
							disabled={$pendingRequestActions[withdrawAction]}
							class="flex-1 border border-[#3f3f46] text-zinc-100 font-bold py-3 rounded-lg text-sm hover:bg-[#27272a] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
						>
							{$pendingRequestActions[withdrawAction] ? 'Withdrawing...' : 'Withdraw To Public Balance'}
						</button>
					</div>
				</form>

				<form class="bg-[#18181b] border border-[#27272a] rounded-lg p-6 space-y-5" onsubmit={handleQuery}>
					<div>
						<h2 class="font-h3 text-h3 text-white">Query Encrypted Balance</h2>
						<p class="text-sm text-zinc-400 mt-1">Reads encrypted balance data in the browser without recording private balances server-side.</p>
					</div>

					<label class="flex flex-col gap-2 text-xs font-bold uppercase text-zinc-400">
						Mint Addresses
						<textarea bind:value={queryMintAddresses} rows="4" class="bg-[#0d0e15] border border-[#3f3f46] rounded-lg px-3 py-2 text-sm normal-case text-zinc-100 placeholder:text-zinc-600" placeholder="Comma-separated mint addresses"></textarea>
					</label>

					<button
						type="submit"
						disabled={$pendingRequestActions[queryAction]}
						class="w-full bg-[#10b981] text-[#002113] font-bold py-3 rounded-lg text-sm hover:bg-[#4edea3] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
					>
						{$pendingRequestActions[queryAction] ? 'Querying...' : 'Query In Browser'}
					</button>

					<pre class="min-h-48 overflow-auto rounded-lg bg-[#0d0e15] border border-[#27272a] p-4 text-xs text-zinc-300 whitespace-pre-wrap">{queryResult}</pre>
				</form>
			</div>
		</main>
	</div>
</div>
