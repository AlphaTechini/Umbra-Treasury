<script lang="ts">
	import { goto } from '$app/navigation';
	import { createTransaction } from '$lib/api/transactions';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import WalletButton from '$lib/components/WalletButton.svelte';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { daoSession, requireActiveUmbraSession, signWalletAuthorization, walletSession } from '$lib/session';
	import { clearActiveUmbraClientSession, depositIntoEncryptedBalance, withdrawFromEncryptedBalance } from '$lib/umbra';
	import { toasts } from '$lib/toasts';
	import { get } from 'svelte/store';
	import { ArrowLeft, Shield, ChevronDown, Lock } from 'lucide-svelte';

	const sendPrivateTransactionAction = 'transactions:send-private';

	// Token mint addresses for devnet
	const TOKEN_MINTS = {
		sol: 'So11111111111111111111111111111111111111112',
		usdc: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
		usdt: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
		wsol: 'So11111111111111111111111111111111111111112'
	};

	// Token decimals
	const TOKEN_DECIMALS = {
		sol: 9,
		usdc: 6,
		usdt: 6,
		wsol: 9
	};

	let transactionType = $state<'income' | 'expense'>('expense');

	async function handleSendPrivateTransaction(event: SubmitEvent) {
		event.preventDefault();
		await runRequestAction(sendPrivateTransactionAction, async () => {
			const dao = get(daoSession).dao;
			const walletAddress = get(walletSession).walletAddress;

			if (!dao || !walletAddress) {
				throw new Error('Connect a wallet before adding a private transaction record.');
			}

			const formData = new FormData(event.currentTarget as HTMLFormElement);
			const recipient = String(formData.get('recipient') ?? '').trim();
			const amount = String(formData.get('amount') ?? '').trim();
			const token = String(formData.get('token') ?? 'sol').trim();
			const category = String(formData.get('category') ?? 'ops').trim();

			// Validate inputs
			if (!amount || parseFloat(amount) <= 0) {
				throw new Error('Enter a valid amount');
			}

			if (transactionType === 'expense' && !recipient) {
				throw new Error('Enter a recipient address for expenses');
			}

			// Clear any cached Umbra session to ensure we use current network config
			clearActiveUmbraClientSession();

			// Get Umbra session
			toasts.add('Initializing Umbra session...', 'info');
			const umbraSession = await requireActiveUmbraSession();

			// Convert amount to base units
			const mintAddress = TOKEN_MINTS[token as keyof typeof TOKEN_MINTS];
			const decimals = TOKEN_DECIMALS[token as keyof typeof TOKEN_DECIMALS];
			const amountBaseUnits = parseBaseUnits(amount, decimals);

			let result;
			let umbraOperationType: 'deposit' | 'withdraw';

			if (transactionType === 'income') {
				// Deposit into encrypted balance
				toasts.add('Depositing into encrypted balance...', 'info');
				result = await depositIntoEncryptedBalance(umbraSession, {
					destinationAddress: walletAddress,
					mintAddress,
					amountBaseUnits
				});
				umbraOperationType = 'deposit';
			} else {
				// Withdraw from encrypted balance to recipient
				toasts.add('Withdrawing from encrypted balance...', 'info');
				result = await withdrawFromEncryptedBalance(umbraSession, {
					destinationAddress: recipient,
					mintAddress,
					amountBaseUnits
				});
				umbraOperationType = 'withdraw';
			}

			// Extract operation references
			const umbraOperationRefs = getUmbraOperationRefs(result, {
				source: 'frontend_real_umbra_transaction',
				mintAddress,
				destinationAddress: transactionType === 'income' ? walletAddress : recipient
			});

			// Sign wallet authorization
			const walletAuthorization = await signWalletAuthorization({
				action: 'treasury_transaction:create',
				daoId: dao.id,
				walletAddress
			});

			// Save transaction to database
			toasts.add('Recording transaction metadata...', 'info');
			await createTransaction(dao.id, {
				createdByWalletAddress: walletAddress,
				walletAuthorization,
				type: transactionType,
				category: toTransactionCategory(category),
				token,
				amountHint: amount,
				date: new Date().toISOString(),
				umbraOperationType,
				umbraOperationRefs
			});

			toasts.add('Private transaction completed successfully!', 'success');
			await goto('/transactions');
		});
	}

	function parseBaseUnits(amount: string, decimals: number): bigint {
		const num = parseFloat(amount);
		if (!Number.isFinite(num) || num <= 0) {
			throw new Error('Invalid amount');
		}
		return BigInt(Math.floor(num * Math.pow(10, decimals)));
	}

	function getUmbraOperationRefs(result: unknown, extra: Record<string, unknown>) {
		const references = extractReferenceStrings(result);
		const viewingKeys = extractViewingKeys(result);
		return {
			...extra,
			resultType: getResultType(result),
			signatures: references.signatures,
			transactionReferences: references.transactionReferences,
			viewingKeys: viewingKeys.length > 0 ? viewingKeys : undefined,
			fullResult: result // Store full result for debugging/disclosure
		};
	}

	function extractViewingKeys(value: unknown): string[] {
		const keys = new Set<string>();

		function visit(nextValue: unknown, key = '') {
			if (typeof nextValue === 'string') {
				const lowerKey = key.toLowerCase();
				// Look for viewing key patterns
				if (lowerKey.includes('viewing') && lowerKey.includes('key')) {
					keys.add(nextValue);
				}
				// Also check for hierarchical key patterns
				if (lowerKey.includes('hierarchical') && lowerKey.includes('key')) {
					keys.add(nextValue);
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
		return Array.from(keys);
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

	function toTransactionCategory(value: string) {
		if (value === 'payroll' || value === 'grant' || value === 'vendor' || value === 'ops') {
			return value;
		}

		return 'other';
	}
</script>

<svelte:head>
	<title>{transactionType === 'income' ? 'Deposit Funds' : 'Send Private Transaction'} – Umbra Treasury</title>
	<meta name="description" content="Send a private transaction via the Umbra shielded protocol." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col h-screen">
		<!-- TopAppBar -->
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 flex-shrink-0 sticky top-0 z-40">
			<div class="flex items-center gap-4">
				<a href="/dashboard" class="text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b] transition-colors p-1.5 rounded-lg">
					<ArrowLeft size={20} />
				</a>
				<h1 class="font-h3 text-h3 text-white">
					{transactionType === 'income' ? 'Deposit Funds' : 'Send Private Transaction'}
				</h1>
			</div>
			<WalletButton />
		</header>

		<main class="flex-1 overflow-y-auto p-6 pb-8">
			<div class="max-w-2xl mx-auto">
				<!-- Privacy Badge -->
				<div class="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4 mb-6 flex items-start gap-3">
					<Shield class="text-[#10b981] mt-0.5" size={20} fill="currentColor" />
					<div>
						<p class="font-data-point text-data-point text-[#10b981] mb-1">Shielded Protocol Active</p>
						{#if transactionType === 'income'}
							<p class="font-body-md text-body-md text-zinc-400">Deposit funds into your encrypted treasury balance. Funds will be private and only you can access them.</p>
						{:else}
							<p class="font-body-md text-body-md text-zinc-400">Send funds privately from your encrypted balance to a recipient. The transaction is shielded on-chain.</p>
						{/if}
					</div>
				</div>

				<!-- Form Card -->
				<form
					class="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col gap-5 mb-6"
					onsubmit={handleSendPrivateTransaction}
				>
					<!-- Transaction Type -->
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase">Transaction Type</label>
						<p class="text-xs text-zinc-500 mb-1">Choose whether you're depositing funds into your treasury or sending funds to someone.</p>
						<div class="grid grid-cols-2 gap-2">
							<label class="cursor-pointer">
								<input type="radio" bind:group={transactionType} value="expense" class="peer sr-only" />
								<div class="border border-[#27272a] rounded-lg px-4 py-3 text-center font-body-md text-body-md text-zinc-400 peer-checked:border-[#10b981] peer-checked:text-[#10b981] peer-checked:bg-[#10b981]/5 hover:border-zinc-500 transition-all">
									<div class="font-bold">Expense (Withdraw)</div>
									<div class="text-xs mt-1 text-zinc-500">Send to recipient</div>
								</div>
							</label>
							<label class="cursor-pointer">
								<input type="radio" bind:group={transactionType} value="income" class="peer sr-only" />
								<div class="border border-[#27272a] rounded-lg px-4 py-3 text-center font-body-md text-body-md text-zinc-400 peer-checked:border-[#10b981] peer-checked:text-[#10b981] peer-checked:bg-[#10b981]/5 hover:border-zinc-500 transition-all">
									<div class="font-bold">Income (Deposit)</div>
									<div class="text-xs mt-1 text-zinc-500">Add to treasury</div>
								</div>
							</label>
						</div>
					</div>

					<!-- Recipient Address (only for expenses) -->
					<div class="flex flex-col gap-2" class:hidden={transactionType === 'income'}>
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase" for="recipient">Recipient Address</label>
						<p class="text-xs text-zinc-500 mb-1">The Solana wallet address that will receive the funds privately.</p>
						<input
							id="recipient"
							name="recipient"
							type="text"
							placeholder="e.g., 7XEkYVAuz9DuyMwkgZ4gxNLihPEDtA2R9uBMUg6YWrX6"
							required={transactionType === 'expense'}
							disabled={transactionType === 'income'}
							class="bg-[#0d0e15] border border-[#27272a] focus:border-zinc-400 focus:ring-0 rounded-lg px-4 py-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 transition-colors"
						/>
					</div>

					<!-- Amount + Token -->
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase" for="amount">Amount & Token</label>
						<p class="text-xs text-zinc-500 mb-1">
							{#if transactionType === 'income'}
								How much you want to deposit into your encrypted treasury balance.
							{:else}
								How much you want to send to the recipient.
							{/if}
						</p>
						<div class="flex gap-2">
							<input
								id="amount"
								name="amount"
								type="text"
								placeholder="0.00"
								required
								class="flex-1 bg-[#0d0e15] border border-[#27272a] focus:border-zinc-400 focus:ring-0 rounded-lg px-4 py-3 font-data-point text-data-point text-zinc-200 placeholder:text-zinc-600 transition-colors"
							/>
							<div class="relative w-36">
								<select
									name="token"
									class="appearance-none w-full bg-[#0d0e15] border border-[#27272a] focus:border-zinc-400 focus:ring-0 rounded-lg px-4 py-3 font-body-md text-body-md text-zinc-200 cursor-pointer transition-colors"
								>
									<option value="sol">SOL</option>
									<option value="usdc">USDC</option>
									<option value="usdt">USDT</option>
								</select>
								<ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
							</div>
						</div>
					</div>

					<!-- Category -->
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase" for="category">Category</label>
						<p class="text-xs text-zinc-500 mb-1">What type of transaction is this? Used for reporting and summaries.</p>
						<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
							{#each ['Payroll', 'Grants', 'Infrastructure', 'Operations'] as cat, i}
								<label class="cursor-pointer">
									<input type="radio" name="category" value={cat === 'Grants' ? 'grant' : cat === 'Infrastructure' || cat === 'Operations' ? 'ops' : cat.toLowerCase()} class="peer sr-only" checked={i === 0} />
									<div class="border border-[#27272a] rounded-lg px-3 py-2 text-center font-body-md text-body-md text-zinc-400 peer-checked:border-[#10b981] peer-checked:text-[#10b981] peer-checked:bg-[#10b981]/5 hover:border-zinc-500 transition-all">
										{cat}
									</div>
								</label>
							{/each}
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="flex gap-3 pt-2">
						<a href="/dashboard" class="px-6 py-3 border border-[#27272a] rounded-lg font-data-point text-data-point text-zinc-300 hover:bg-[#27272a] transition-colors">
							Cancel
						</a>
						<button
							type="submit"
							disabled={$pendingRequestActions[sendPrivateTransactionAction]}
							class="flex-1 bg-[#10b981] text-[#002113] font-bold py-3 rounded-lg text-sm tracking-wide hover:bg-[#4edea3] transition-colors active:scale-[0.99] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
						>
							<Lock size={18} />
							{#if $pendingRequestActions[sendPrivateTransactionAction]}
								Processing...
							{:else if transactionType === 'income'}
								Deposit to Encrypted Balance
							{:else}
								Send Private Transaction
							{/if}
						</button>
					</div>
				</form>

				<!-- Footer -->
				<p class="text-center font-label-mono text-label-mono text-zinc-600 mt-6 uppercase tracking-widest">
					Encrypted. Verifiable. Private.
				</p>
			</div>
		</main>
	</div>
</div>
