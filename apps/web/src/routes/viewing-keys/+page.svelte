<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchTransactions } from '$lib/api/transactions';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import WalletButton from '$lib/components/WalletButton.svelte';
	import { formatCurrency, formatDateTime } from '$lib/display';
	import { daoSession } from '$lib/session';
	import { Copy, Key, ExternalLink, Eye, EyeOff } from 'lucide-svelte';
	import { toasts } from '$lib/toasts';

	let transactions = $state<any[]>([]);
	let loading = $state(true);
	let visibleKeys = $state<Set<string>>(new Set());

	$effect(() => {
		const dao = $daoSession.dao;
		if (dao) {
			loadTransactions(dao.id);
		}
	});

	async function loadTransactions(daoId: string) {
		loading = true;
		try {
			const result = await fetchTransactions(daoId);
			transactions = result.filter(tx => {
				const refs = tx.umbraOperationRefs as any;
				return refs?.viewingKeys && refs.viewingKeys.length > 0;
			});
		} catch (error) {
			toasts.add('Failed to load transactions', 'error');
			console.error(error);
		} finally {
			loading = false;
		}
	}

	function copyToClipboard(text: string, label: string) {
		navigator.clipboard.writeText(text);
		toasts.add(`${label} copied to clipboard`, 'success');
	}

	function toggleKeyVisibility(txId: string) {
		if (visibleKeys.has(txId)) {
			visibleKeys.delete(txId);
		} else {
			visibleKeys.add(txId);
		}
		visibleKeys = new Set(visibleKeys);
	}

	function getTransactionReference(tx: any): string {
		const refs = tx.umbraOperationRefs as any;
		if (refs?.signatures && refs.signatures.length > 0) {
			return refs.signatures[0];
		}
		if (refs?.transactionReferences && refs.transactionReferences.length > 0) {
			return refs.transactionReferences[0];
		}
		return tx.id;
	}

	function formatReference(ref: string): string {
		if (ref.length > 16) {
			return `${ref.slice(0, 8)}...${ref.slice(-8)}`;
		}
		return ref;
	}

	function maskKey(key: string): string {
		if (key.length > 16) {
			return `${key.slice(0, 8)}${'•'.repeat(32)}${key.slice(-8)}`;
		}
		return '•'.repeat(key.length);
	}
</script>

<svelte:head>
	<title>Viewing Keys – Umbra Treasury</title>
	<meta name="description" content="View and manage Umbra viewing keys for your private transactions." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 flex-shrink-0 sticky top-0 z-40">
			<div>
				<h1 class="font-h3 text-h3 text-white">Viewing Keys</h1>
				<p class="text-xs text-zinc-500 mt-0.5">Manage disclosure keys for your private transactions</p>
			</div>
			<WalletButton />
		</header>

		<main class="flex-1 overflow-y-auto p-6">
			<div class="max-w-6xl mx-auto">
				<!-- Info Banner -->
				<div class="bg-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-lg p-4 mb-6 flex items-start gap-3">
					<Key class="text-[#3b82f6] mt-0.5 flex-shrink-0" size={20} />
					<div>
						<p class="font-data-point text-data-point text-[#3b82f6] mb-1">About Viewing Keys</p>
						<p class="font-body-md text-body-md text-zinc-400">
							Viewing keys allow you to selectively disclose transaction details to auditors or stakeholders. 
							Each key can decrypt specific transaction information while keeping other transactions private.
						</p>
					</div>
				</div>

				{#if loading}
					<div class="text-center py-12">
						<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
						<p class="text-zinc-400 mt-4">Loading transactions...</p>
					</div>
				{:else if !$daoSession.dao}
					<div class="text-center py-12">
						<Key class="mx-auto text-zinc-600 mb-4" size={48} />
						<p class="text-zinc-400 mb-4">Connect a wallet to view your viewing keys</p>
						<button
							onclick={() => goto('/connect-wallet')}
							class="bg-[#10b981] text-[#002113] font-bold px-6 py-3 rounded-lg text-sm hover:bg-[#4edea3] transition-colors"
						>
							Connect Wallet
						</button>
					</div>
				{:else if transactions.length === 0}
					<div class="text-center py-12">
						<Key class="mx-auto text-zinc-600 mb-4" size={48} />
						<p class="text-zinc-400 mb-4">No transactions with viewing keys yet</p>
						<p class="text-zinc-500 text-sm mb-6">Viewing keys are generated when you deposit or withdraw funds using Umbra</p>
						<button
							onclick={() => goto('/transactions/add')}
							class="bg-[#10b981] text-[#002113] font-bold px-6 py-3 rounded-lg text-sm hover:bg-[#4edea3] transition-colors"
						>
							Create Transaction
						</button>
					</div>
				{:else}
					<div class="space-y-4">
						{#each transactions as tx (tx.id)}
							{@const refs = tx.umbraOperationRefs as any}
							{@const viewingKeys = refs?.viewingKeys || []}
							{@const isVisible = visibleKeys.has(tx.id)}
							{@const txRef = getTransactionReference(tx)}
							
							<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-6">
								<!-- Transaction Header -->
								<div class="flex items-start justify-between mb-4">
									<div class="flex-1">
										<div class="flex items-center gap-2 mb-1">
											<span class="text-white font-bold capitalize">{tx.type}</span>
											<span class="text-zinc-600">•</span>
											<span class="text-zinc-400 capitalize">{tx.category.replace('_', ' ')}</span>
										</div>
										<div class="flex items-center gap-2 text-sm text-zinc-500">
											<span>{formatDateTime(tx.date)}</span>
											{#if tx.amountHint}
												<span>•</span>
												<span>{formatCurrency(parseFloat(tx.amountHint), tx.token.toUpperCase())}</span>
											{/if}
										</div>
									</div>
									<div class="flex items-center gap-2">
										<span class="px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
											{tx.umbraOperationType}
										</span>
									</div>
								</div>

								<!-- Transaction Reference -->
								<div class="mb-4 p-3 bg-[#0d0e15] rounded-lg border border-[#27272a]">
									<div class="flex items-center justify-between">
										<div class="flex-1 min-w-0">
											<p class="text-xs text-zinc-500 mb-1">Transaction Reference</p>
											<p class="text-sm text-zinc-300 font-mono truncate">{txRef}</p>
										</div>
										<button
											onclick={() => copyToClipboard(txRef, 'Reference')}
											class="ml-2 p-2 hover:bg-[#27272a] rounded-lg transition-colors flex-shrink-0"
											title="Copy reference"
										>
											<Copy size={16} class="text-zinc-400" />
										</button>
									</div>
								</div>

								<!-- Viewing Keys -->
								<div class="space-y-3">
									<div class="flex items-center justify-between">
										<p class="text-sm font-bold text-zinc-300">Viewing Keys ({viewingKeys.length})</p>
										<button
											onclick={() => toggleKeyVisibility(tx.id)}
											class="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-[#27272a] rounded-lg transition-colors"
										>
											{#if isVisible}
												<EyeOff size={14} />
												Hide Keys
											{:else}
												<Eye size={14} />
												Show Keys
											{/if}
										</button>
									</div>

									{#each viewingKeys as key, index}
										<div class="p-3 bg-[#0d0e15] rounded-lg border border-[#27272a]">
											<div class="flex items-start justify-between gap-3">
												<div class="flex-1 min-w-0">
													<p class="text-xs text-zinc-500 mb-2">Key #{index + 1}</p>
													<p class="text-sm text-zinc-300 font-mono break-all">
														{isVisible ? key : maskKey(key)}
													</p>
												</div>
												<div class="flex gap-1 flex-shrink-0">
													<button
														onclick={() => copyToClipboard(key, 'Viewing key')}
														class="p-2 hover:bg-[#27272a] rounded-lg transition-colors"
														title="Copy key"
													>
														<Copy size={16} class="text-zinc-400" />
													</button>
												</div>
											</div>
										</div>
									{/each}
								</div>

								<!-- Usage Instructions -->
								<div class="mt-4 p-3 bg-[#3b82f6]/5 border border-[#3b82f6]/20 rounded-lg">
									<p class="text-xs text-zinc-400">
										<span class="text-[#3b82f6] font-bold">How to use:</span> Share this viewing key with auditors or stakeholders 
										to allow them to decrypt and verify this specific transaction without revealing your entire transaction history.
									</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</main>
	</div>
</div>
