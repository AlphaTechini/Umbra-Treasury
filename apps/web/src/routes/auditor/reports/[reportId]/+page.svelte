<script lang="ts">
	import { page } from '$app/stores';
	import { getReport } from '$lib/api/reports';
	import type { Report } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatDate, formatLabel, shortId } from '$lib/display';
	import { walletSession } from '$lib/session';
	import { onMount } from 'svelte';

	let report = $state<Report | null>(null);
	let isLoadingData = $state(true);
	let errorMessage = $state<string | null>(null);
	let accessDenied = $state(false);
	
	const wallet = $derived($walletSession);
	const reportId = $derived($page.params.reportId);

	const transactions = $derived(
		report?.reportData?.transactions as Array<{
			id: string;
			type: string;
			category: string;
			token: string;
			amountHint: string;
			date: string;
			publicCounterpartyLabel?: string;
			publicMemo?: string;
			umbraOperationType?: string;
			privacyStatus?: string;
		}> || []
	);

	onMount(async () => {
		if (wallet.status !== 'connected' || !wallet.walletAddress) {
			errorMessage = 'Connect your wallet to view this report.';
			isLoadingData = false;
			return;
		}

		if (!reportId) {
			errorMessage = 'Invalid report ID.';
			isLoadingData = false;
			return;
		}

		try {
			const response = await getReport(reportId);
			report = response.report;

			// Check if the connected wallet matches the requester
			if (report.disclosureRequest?.requesterContact !== wallet.walletAddress) {
				accessDenied = true;
				errorMessage = 'Access denied. This report was not requested by your wallet.';
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Failed to load report.';
		} finally {
			isLoadingData = false;
		}
	});

	function shortAddress(address: string) {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}

	function getSourceBadgeColor(source: string) {
		switch (source) {
			case 'umbra_compliance':
				return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
			case 'mock':
				return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
			default:
				return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30';
		}
	}

	function getVerificationColor(status: string) {
		switch (status) {
			case 'verified':
				return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
			case 'failed':
				return 'bg-red-500/20 text-red-500 border-red-500/30';
			default:
				return 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30';
		}
	}
</script>

<svelte:head>
	<title>Disclosure Report - Umbra Treasury</title>
	<meta name="description" content="View disclosed transaction data." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center flex-1">
				<a href="/auditor/requests" class="text-xs text-zinc-400 hover:text-white transition-colors">
					← Back to Requests
				</a>
			</div>
			<div class="flex items-center gap-3">
				{#if wallet.status === 'connected' && wallet.walletAddress}
					<div class="flex items-center gap-2 bg-[#18181b] border border-[#27272a] px-4 py-1.5 rounded">
						<span class="text-[#10b981] text-xs font-mono">{shortAddress(wallet.walletAddress)}</span>
					</div>
				{:else}
					<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
						Connect Wallet
					</a>
				{/if}
			</div>
		</header>

		<main class="flex-1 overflow-y-auto p-6 space-y-6">
			{#if isLoadingData}
				<div class="flex items-center justify-center py-12">
					<p class="text-zinc-500">Loading report...</p>
				</div>
			{:else if errorMessage || accessDenied}
				<div class="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
					<p class="text-red-500 font-bold mb-2">{accessDenied ? 'Access Denied' : 'Error'}</p>
					<p class="text-zinc-400 text-sm">{errorMessage}</p>
					{#if !wallet.walletAddress}
						<a href="/connect-wallet" class="inline-block mt-4 bg-[#10b981] text-[#002113] font-bold px-4 py-2 rounded text-xs hover:bg-[#4edea3] transition-colors">
							Connect Wallet
						</a>
					{/if}
				</div>
			{:else if report}
				<div class="space-y-6">
					<!-- Report Header -->
					<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-6">
						<div class="flex items-start justify-between mb-4">
							<div>
								<h1 class="font-h2 text-h2 text-white">{report.title}</h1>
								<p class="font-body-md text-body-md text-zinc-400 mt-1">Report ID: {shortId(report.id)}</p>
							</div>
							<div class="flex gap-2">
								<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border {getSourceBadgeColor(report.source)}">
									{formatLabel(report.source)}
								</span>
								<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border {getVerificationColor(report.verificationStatus)}">
									{formatLabel(report.verificationStatus)}
								</span>
							</div>
						</div>

						<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
							<div>
								<p class="text-xs text-zinc-500 uppercase tracking-wider mb-1">DAO</p>
								<p class="text-sm text-white font-medium">{report.dao?.name || 'Unknown'}</p>
							</div>
							<div>
								<p class="text-xs text-zinc-500 uppercase tracking-wider mb-1">Report Type</p>
								<p class="text-sm text-white font-medium">{formatLabel(report.type)}</p>
							</div>
							<div>
								<p class="text-xs text-zinc-500 uppercase tracking-wider mb-1">Generated</p>
								<p class="text-sm text-white font-medium">{formatDate(report.generatedAt)}</p>
							</div>
							<div>
								<p class="text-xs text-zinc-500 uppercase tracking-wider mb-1">Transactions</p>
								<p class="text-sm text-white font-medium">{report.reportData?.transactionCount || transactions.length}</p>
							</div>
						</div>

						{#if report.startDate || report.endDate}
							<div class="mt-4 pt-4 border-t border-[#27272a]">
								<p class="text-xs text-zinc-500 uppercase tracking-wider mb-1">Date Range</p>
								<p class="text-sm text-white">
									{report.startDate ? formatDate(report.startDate) : 'Beginning'} — {report.endDate ? formatDate(report.endDate) : 'Present'}
								</p>
							</div>
						{/if}
					</div>

					<!-- Disclosed Transactions -->
					<div class="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
						<div class="px-6 py-4 border-b border-[#27272a]">
							<h2 class="font-h3 text-h3 text-white">Disclosed Transactions</h2>
							<p class="text-sm text-zinc-400 mt-1">Private transaction data disclosed for this request</p>
						</div>

						<div class="overflow-x-auto">
							<table class="w-full text-left">
								<thead class="bg-[#0d0e15] text-zinc-500 font-label-mono text-[11px] uppercase tracking-widest">
									<tr>
										<th class="px-6 py-4">Transaction ID</th>
										<th class="px-6 py-4">Type</th>
										<th class="px-6 py-4">Category</th>
										<th class="px-6 py-4">Amount</th>
										<th class="px-6 py-4">Token</th>
										<th class="px-6 py-4">Date</th>
										<th class="px-6 py-4">Counterparty</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-[#27272a]">
									{#if transactions.length === 0}
										<tr>
											<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">No transactions in this report.</td>
										</tr>
									{:else}
										{#each transactions as tx}
											<tr class="hover:bg-[#1e1f26] transition-colors">
												<td class="px-6 py-4 font-mono text-xs text-zinc-300">{shortId(tx.id)}</td>
												<td class="px-6 py-4 text-sm text-zinc-200">{formatLabel(tx.type)}</td>
												<td class="px-6 py-4 text-sm text-zinc-400">{formatLabel(tx.category)}</td>
												<td class="px-6 py-4 font-mono text-sm text-white">{tx.amountHint}</td>
												<td class="px-6 py-4 text-xs text-zinc-400 uppercase">{tx.token}</td>
												<td class="px-6 py-4 text-xs text-zinc-500">{formatDate(tx.date)}</td>
												<td class="px-6 py-4 text-sm text-zinc-400">{tx.publicCounterpartyLabel || '—'}</td>
											</tr>
										{/each}
									{/if}
								</tbody>
							</table>
						</div>
					</div>

					<!-- Report Metadata -->
					{#if report.reportData?.notes && Array.isArray(report.reportData.notes) && report.reportData.notes.length > 0}
						<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-6">
							<h3 class="font-h3 text-h3 text-white mb-3">Notes</h3>
							<ul class="space-y-2">
								{#each report.reportData.notes as note}
									<li class="text-sm text-zinc-400">• {note}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/if}
		</main>
	</div>
</div>
