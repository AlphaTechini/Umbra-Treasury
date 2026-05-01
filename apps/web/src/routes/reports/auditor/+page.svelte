<script lang="ts">
	import { getDaoReports } from '$lib/api/reports';
	import type { Report } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatCurrency, formatDate, formatLabel, shortId } from '$lib/display';
	import { daoSession } from '$lib/session';
	import { onMount } from 'svelte';

	type ReportTransaction = {
		id?: string;
		date?: string;
		publicCounterpartyLabel?: string | null;
		category?: string;
		amountHint?: string | null;
		privacyStatus?: string;
	};

	let report = $state<Report | null>(null);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading auditor report data...');

	onMount(async () => {
		const dao = await daoSession.loadDemoDao();

		if (!dao) {
			emptyMessage = 'No data yet. Connect a wallet or create a DAO treasury to begin.';
			isLoadingData = false;
			return;
		}

		try {
			const response = await getDaoReports(dao.id);
			report = response.reports.find((item) => item.type === 'auditor_report') ?? null;
			emptyMessage = 'No auditor report data yet.';
		} catch (error) {
			emptyMessage = error instanceof Error ? error.message : 'No data yet.';
		} finally {
			isLoadingData = false;
		}
	});

	const transactions = $derived((report?.reportData.transactions as ReportTransaction[] | undefined) ?? []);
</script>

<svelte:head>
	<title>Auditor Report - Umbra Treasury</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<span class="text-xl font-bold tracking-tighter text-white">Umbra Treasury</span>
			<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
				Connect Wallet
			</a>
		</header>

		<main class="flex-1 overflow-y-auto p-6 lg:p-12">
			<div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
				<div>
					<nav class="flex text-zinc-500 text-xs mb-2 font-label-mono uppercase tracking-widest">
						<span>Treasury</span>
						<span class="mx-2">/</span>
						<span class="text-[#10b981]">Reports</span>
					</nav>
					<h2 class="font-h2 text-h2 text-white">{report?.title ?? 'Auditor Report'}</h2>
					<p class="text-zinc-400 text-sm mt-1">{report ? `${formatLabel(report.source)} - ${formatLabel(report.verificationStatus)}` : emptyMessage}</p>
				</div>
				<button class="bg-[#10b981] text-[#002113] font-bold text-sm px-6 py-3 rounded hover:bg-[#4edea3] transition-colors flex items-center">
					<span class="material-symbols-outlined mr-2">file_download</span>
					Export Report
				</button>
			</div>

			<div class="flex gap-8 mb-8 border-b border-[#27272a] overflow-x-auto no-scrollbar">
				<a href="/reports/public" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">Public Summary</a>
				<div class="pb-4 text-sm font-medium text-[#10b981] relative whitespace-nowrap">
					Auditor Report
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]"></div>
				</div>
				<a href="/reports/tax" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">Tax Estimate</a>
			</div>

			<div class="grid grid-cols-12 gap-6">
				<div class="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] p-6 rounded-lg">
					<h3 class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest mb-4">Revealed Volume</h3>
					<div class="flex items-baseline gap-2">
						<span class="font-h2 text-h2 text-white">{isLoadingData ? 'Loading...' : transactions.length}</span>
						<span class="text-[#10b981] font-bold">TX</span>
					</div>
				</div>
				<div class="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] p-6 rounded-lg">
					<h3 class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest mb-4">Verification</h3>
					<span class="font-h3 text-h3 text-white">{formatLabel(report?.verificationStatus)}</span>
				</div>
				<div class="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] p-6 rounded-lg">
					<h3 class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest mb-4">Generated</h3>
					<span class="font-h3 text-h3 text-white">{formatDate(report?.generatedAt)}</span>
				</div>

				<div class="col-span-12 bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
					<div class="p-6 border-b border-[#27272a] flex justify-between items-center">
						<h3 class="font-h3 text-h3 text-white">Revealed Transactions</h3>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full text-left font-body-md border-collapse">
							<thead>
								<tr class="bg-[#0d0e15] border-b border-[#27272a]">
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Date</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Counterparty</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Category</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest text-right">Amount</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest text-center">Status</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-[#27272a]">
								{#if isLoadingData}
									<tr>
										<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="5">Loading report data...</td>
									</tr>
								{:else if transactions.length === 0}
									<tr>
										<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="5">{emptyMessage}</td>
									</tr>
								{:else}
									{#each transactions as tx}
										<tr class="hover:bg-[#1e1f26] transition-colors">
											<td class="px-6 py-4 text-zinc-400 text-sm">{formatDate(tx.date)}</td>
											<td class="px-6 py-4 font-mono text-sm text-white">{tx.publicCounterpartyLabel ?? shortId(tx.id)}</td>
											<td class="px-6 py-4">
												<span class="px-2 py-1 bg-[#27272a] border border-[#3c4a42] rounded text-[10px] uppercase font-bold text-zinc-400">{formatLabel(tx.category)}</span>
											</td>
											<td class="px-6 py-4 text-right font-data-point text-data-point text-white">{formatCurrency(tx.amountHint)}</td>
											<td class="px-6 py-4 text-center">
												<span class="material-symbols-outlined text-[#10b981] text-xl" style="font-variation-settings: 'FILL' 1;">visibility</span>
											</td>
										</tr>
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
