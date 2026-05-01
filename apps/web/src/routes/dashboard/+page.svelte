<script lang="ts">
	import { getDaoSummary } from '$lib/api/daos';
	import { getDaoDisclosureRequests } from '$lib/api/disclosures';
	import { getDaoTransactions } from '$lib/api/transactions';
	import type { DisclosureRequest, PublicSummary, TreasuryTransaction } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatCurrency, formatDate, formatLabel, shortId } from '$lib/display';
	import { daoSession } from '$lib/session';
	import { onMount } from 'svelte';

	let summary = $state<PublicSummary | null>(null);
	let transactions = $state<TreasuryTransaction[]>([]);
	let disclosureRequests = $state<DisclosureRequest[]>([]);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading treasury data...');

	onMount(async () => {
		const dao = await daoSession.loadDemoDao();

		if (!dao) {
			emptyMessage = 'No data yet. Connect a wallet or create a DAO treasury to begin.';
			isLoadingData = false;
			return;
		}

		try {
			const [summaryResponse, transactionResponse, disclosureResponse] = await Promise.all([
				getDaoSummary(dao.id),
				getDaoTransactions(dao.id),
				getDaoDisclosureRequests(dao.id)
			]);

			summary = summaryResponse.summary;
			transactions = transactionResponse.transactions;
			disclosureRequests = disclosureResponse.disclosureRequests;
			emptyMessage = 'No data yet.';
		} catch (error) {
			emptyMessage = error instanceof Error ? error.message : 'No data yet.';
		} finally {
			isLoadingData = false;
		}
	});

	const pendingDisclosureCount = $derived(disclosureRequests.filter((request) => request.status === 'pending').length);
	const recentTransactions = $derived(transactions.slice(0, 5));

	function getTransactionStatus(transaction: TreasuryTransaction) {
		return transaction.privacyStatus === 'disclosure_available' ? 'Revealed' : formatLabel(transaction.privacyStatus);
	}

	function getTransactionStatusColor(transaction: TreasuryTransaction) {
		return transaction.privacyStatus === 'disclosure_available' ? 'bg-[#10b981]' : 'bg-zinc-600';
	}
</script>

<svelte:head>
	<title>DAO Treasury Dashboard - Umbra Treasury</title>
	<meta name="description" content="Private DAO treasury management with institutional-grade financial controls and selective disclosure." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center flex-1"></div>
			<div class="flex items-center gap-3">
				<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
					Connect Wallet
				</a>
			</div>
		</header>

		<main class="flex-1 overflow-y-auto p-6 space-y-6">
			<div class="flex items-end justify-between">
				<div>
					<h1 class="font-h2 text-h2 text-white">{summary?.dao.name ?? 'Treasury Overview'}</h1>
					<p class="font-body-md text-body-md text-zinc-400 mt-1">{summary?.privacy.note ?? 'Institutional-grade private treasury operations.'}</p>
				</div>
				<div class="flex gap-2">
					<a href="/transactions/add" class="flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2 rounded hover:bg-zinc-200 transition-colors active:scale-[0.98]">
						<span class="material-symbols-outlined text-[16px]">add</span>
						New Transaction
					</a>
				</div>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Net Treasury</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">account_balance</span>
					</div>
					<div class="font-h2 text-h2 text-white">{isLoadingData ? 'Loading...' : formatCurrency(summary?.totals.net)}</div>
					<div class="font-data-point text-data-point text-[#10b981]">{summary?.dao.baseToken?.toUpperCase() ?? 'No data yet'}</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Private Txns</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">lock</span>
					</div>
					<div class="font-h2 text-h2 text-white">{isLoadingData ? '...' : (summary?.totals.transactionCount ?? 0)}</div>
					<div class="font-data-point text-data-point text-zinc-400">Recorded transactions</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Pending Reveals</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">visibility</span>
					</div>
					<div class="font-h2 text-h2 text-white">{isLoadingData ? '...' : pendingDisclosureCount}</div>
					<div class="font-data-point text-data-point text-zinc-400">Awaiting approval</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Report Source</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">verified_user</span>
					</div>
					<div class="font-h3 text-h3 text-white">{formatLabel(summary?.privacy.source)}</div>
					<div class="font-data-point text-data-point text-[#10b981]">{formatLabel(summary?.privacy.verificationStatus)}</div>
				</div>
			</div>

			<div class="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
				<div class="px-6 py-4 border-b border-[#27272a] flex items-center justify-between">
					<h2 class="font-h3 text-h3 text-white">Recent Transactions</h2>
					<div class="flex items-center gap-2">
						<div class="flex border border-[#27272a] rounded-lg p-1 bg-[#0d0e15]">
							<button class="px-3 py-1 text-xs font-bold bg-[#10b981] text-black rounded">All</button>
							<button class="px-3 py-1 text-xs font-bold text-zinc-400 hover:text-white rounded transition-colors">Pending</button>
							<button class="px-3 py-1 text-xs font-bold text-zinc-400 hover:text-white rounded transition-colors">Revealed</button>
						</div>
					</div>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead class="bg-[#0d0e15] text-zinc-500 font-label-mono text-[11px] uppercase tracking-widest">
							<tr>
								<th class="px-6 py-4">Transaction ID</th>
								<th class="px-6 py-4">Status</th>
								<th class="px-6 py-4">Amount</th>
								<th class="px-6 py-4">Counterparty</th>
								<th class="px-6 py-4">Category</th>
								<th class="px-6 py-4">Date</th>
								<th class="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#27272a]">
							{#if isLoadingData}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">Loading treasury data...</td>
								</tr>
							{:else if recentTransactions.length === 0}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">{emptyMessage}</td>
								</tr>
							{:else}
								{#each recentTransactions as tx}
									<tr class="hover:bg-[#1e1f26] transition-colors">
										<td class="px-6 py-4 font-mono text-xs text-zinc-300">{shortId(tx.id)}</td>
										<td class="px-6 py-4">
											<div class="flex items-center gap-2">
												<div class="w-1.5 h-1.5 rounded-full {getTransactionStatusColor(tx)}"></div>
												<span class="text-xs text-zinc-300">{getTransactionStatus(tx)}</span>
											</div>
										</td>
										<td class="px-6 py-4 font-data-point text-data-point text-white">{formatCurrency(tx.amountHint)}</td>
										<td class="px-6 py-4 font-mono text-xs text-zinc-300">{tx.publicCounterpartyLabel ?? 'No data yet'}</td>
										<td class="px-6 py-4">
											<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981]">{formatLabel(tx.category)}</span>
										</td>
										<td class="px-6 py-4 text-xs text-zinc-500">{formatDate(tx.date)}</td>
										<td class="px-6 py-4 text-right">
											<a href="/transactions/reveal" class="text-xs text-[#10b981] hover:underline">Reveal</a>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	</div>
</div>
