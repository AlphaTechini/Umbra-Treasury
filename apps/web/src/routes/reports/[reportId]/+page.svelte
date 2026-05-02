<script lang="ts">
	import { page } from '$app/stores';
	import { getReport } from '$lib/api/reports';
	import type { Report } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatCurrency, formatDate, formatLabel, shortId } from '$lib/display';
	import { onMount } from 'svelte';

	type ReportTransaction = {
		id?: string;
		type?: string;
		category?: string;
		token?: string;
		amountHint?: string | null;
		date?: string;
		publicCounterpartyLabel?: string | null;
		publicMemo?: string | null;
		umbraOperationType?: string;
		privacyStatus?: string;
	};

	let report = $state<Report | null>(null);
	let isLoadingReport = $state(true);
	let emptyMessage = $state('Loading report...');

	const transactions = $derived((report?.reportData.transactions as ReportTransaction[] | undefined) ?? []);

	onMount(async () => {
		try {
			const reportId = $page.params.reportId;

			if (!reportId) {
				throw new Error('Report id is required.');
			}

			const response = await getReport(reportId);
			report = response.report;
			emptyMessage = 'No report data yet.';
		} catch (error) {
			emptyMessage = error instanceof Error ? error.message : 'Unable to load report.';
		} finally {
			isLoadingReport = false;
		}
	});
</script>

<svelte:head>
	<title>{report?.title ?? 'Report'} - Umbra Treasury</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b] text-white">
	<Sidebar />

	<main class="flex-1 md:ml-64 overflow-y-auto p-6 lg:p-10 space-y-6">
		<header class="flex flex-col gap-3 border-b border-[#27272a] pb-6">
			<a href="/reports" class="text-sm text-zinc-500 hover:text-white transition-colors">Back to reports</a>
			<div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
				<div>
					<h1 class="text-3xl font-bold tracking-tight">{report?.title ?? 'Report Detail'}</h1>
					<p class="text-sm text-zinc-500 mt-2">{report ? `${formatLabel(report.source)} - ${formatLabel(report.verificationStatus)}` : emptyMessage}</p>
				</div>
				<div class="flex gap-2">
					<span class="text-[10px] uppercase font-bold px-2 py-1 rounded border border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">{formatLabel(report?.type)}</span>
					<span class="text-[10px] uppercase font-bold px-2 py-1 rounded border border-zinc-700 bg-zinc-900 text-zinc-300">{formatDate(report?.generatedAt)}</span>
				</div>
			</div>
		</header>

		<section class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5">
				<p class="text-xs uppercase font-bold text-zinc-500">Source</p>
				<p class="text-xl font-bold mt-2">{formatLabel(report?.source)}</p>
			</div>
			<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5">
				<p class="text-xs uppercase font-bold text-zinc-500">Verification</p>
				<p class="text-xl font-bold mt-2">{formatLabel(report?.verificationStatus)}</p>
			</div>
			<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5">
				<p class="text-xs uppercase font-bold text-zinc-500">Transactions</p>
				<p class="text-xl font-bold mt-2">{transactions.length}</p>
			</div>
		</section>

		<section class="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
			<div class="px-6 py-4 border-b border-[#27272a]">
				<h2 class="font-bold">Report Transactions</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead class="bg-[#0d0e15] text-zinc-500 text-[11px] uppercase tracking-widest">
						<tr>
							<th class="px-6 py-4">ID</th>
							<th class="px-6 py-4">Date</th>
							<th class="px-6 py-4">Category</th>
							<th class="px-6 py-4">Counterparty</th>
							<th class="px-6 py-4 text-right">Amount</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-[#27272a]">
						{#if isLoadingReport}
							<tr>
								<td colspan="5" class="px-6 py-8 text-center text-sm text-zinc-500">Loading report...</td>
							</tr>
						{:else if transactions.length === 0}
							<tr>
								<td colspan="5" class="px-6 py-8 text-center text-sm text-zinc-500">{emptyMessage}</td>
							</tr>
						{:else}
							{#each transactions as transaction}
								<tr class="hover:bg-[#1e1f26] transition-colors">
									<td class="px-6 py-4 font-mono text-xs text-zinc-300">{shortId(transaction.id)}</td>
									<td class="px-6 py-4 text-sm text-zinc-400">{formatDate(transaction.date)}</td>
									<td class="px-6 py-4 text-sm text-zinc-300">{formatLabel(transaction.category)}</td>
									<td class="px-6 py-4 text-sm text-zinc-400">{transaction.publicCounterpartyLabel ?? transaction.publicMemo ?? 'No data yet'}</td>
									<td class="px-6 py-4 text-right text-sm font-bold">{formatCurrency(transaction.amountHint)}</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</section>
	</main>
</div>
