<script lang="ts">
	import { getDaoSummary } from '$lib/api/daos';
	import type { PublicSummary } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatCurrency, formatLabel } from '$lib/display';
	import { daoSession } from '$lib/session';
	import { onMount } from 'svelte';

	let summary = $state<PublicSummary | null>(null);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading public treasury data...');

	onMount(async () => {
		const dao = await daoSession.loadDemoDao();

		if (!dao) {
			emptyMessage = 'No data yet. Connect a wallet or create a DAO treasury to begin.';
			isLoadingData = false;
			return;
		}

		try {
			const response = await getDaoSummary(dao.id);
			summary = response.summary;
			emptyMessage = 'No data yet.';
		} catch (error) {
			emptyMessage = error instanceof Error ? error.message : 'No data yet.';
		} finally {
			isLoadingData = false;
		}
	});

	const categories = $derived(Object.entries(summary?.categoryBreakdown ?? {}));
</script>

<svelte:head>
	<title>Public Treasury View - Umbra Treasury</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center gap-8">
				<span class="text-xl font-bold tracking-tighter text-white">Public Treasury</span>
			</div>
			<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
				Connect Wallet
			</a>
		</header>

		<main class="flex-1 overflow-y-auto p-6 lg:p-12 space-y-12">
			<header class="max-w-3xl">
				<h1 class="font-h1 text-h1 text-white mb-2">{summary?.dao.name ?? 'Umbra Treasury'}</h1>
				<p class="font-body-lg text-body-lg text-zinc-400">
					{summary?.privacy.note ?? emptyMessage}
				</p>
			</header>

			<section class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col justify-between">
					<div class="flex justify-between items-start mb-6">
						<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Total Income</h3>
						<span class="material-symbols-outlined text-[#10b981]">arrow_upward</span>
					</div>
					<div class="font-h2 text-h2 text-white">{isLoadingData ? 'Loading...' : formatCurrency(summary?.totals.income)}</div>
					<div class="mt-2 text-[#10b981] font-data-point text-data-point">{summary?.dao.baseToken?.toUpperCase() ?? 'No data yet'}</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col justify-between">
					<div class="flex justify-between items-start mb-6">
						<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Total Expenses</h3>
						<span class="material-symbols-outlined text-red-400">arrow_downward</span>
					</div>
					<div class="font-h2 text-h2 text-white">{isLoadingData ? 'Loading...' : formatCurrency(summary?.totals.expenses)}</div>
					<div class="mt-2 text-zinc-500 font-data-point text-data-point">{formatLabel(summary?.privacy.source)}</div>
				</div>
				<div class="bg-[#1e1f26] border border-[#10b981]/30 p-6 rounded-lg flex flex-col justify-between relative overflow-hidden">
					<div class="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent pointer-events-none"></div>
					<div class="flex justify-between items-start mb-6 relative z-10">
						<h3 class="font-label-mono text-label-mono text-[#10b981] uppercase">Net Treasury</h3>
						<span class="material-symbols-outlined text-[#10b981]">account_balance</span>
					</div>
					<div class="font-h2 text-h2 text-[#10b981] relative z-10">{isLoadingData ? 'Loading...' : formatCurrency(summary?.totals.net)}</div>
					<div class="mt-2 text-zinc-400 font-data-point text-data-point relative z-10">{formatLabel(summary?.privacy.verificationStatus)}</div>
				</div>
			</section>

			<section class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-6 flex flex-col justify-center items-center text-center min-h-[240px]">
					<div class="w-16 h-16 rounded-full bg-[#27272a] flex items-center justify-center mb-4 border border-[#3c4a42]">
						<span class="material-symbols-outlined text-white text-3xl">lock</span>
					</div>
					<h2 class="font-h3 text-h3 text-white mb-2">{summary?.totals.transactionCount ?? 0} Private Transactions</h2>
					<p class="font-body-md text-body-md text-zinc-400">Public-safe summary</p>
				</div>
				<div class="flex flex-col justify-center border-l border-[#27272a] pl-12">
					<div class="flex items-center gap-2 mb-4">
						<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">shield</span>
						<span class="font-label-mono text-label-mono text-[#10b981] uppercase tracking-widest">Privacy Preserved</span>
					</div>
					<p class="font-body-lg text-body-lg text-white mb-6">
						Detailed transactions stay private. This page only shows backend-provided public-safe treasury summaries.
					</p>
					<a href="/disclosures/request" class="inline-flex items-center gap-2 bg-transparent border border-[#27272a] text-white font-data-point text-data-point py-2 px-6 rounded hover:bg-[#18181b] transition-colors">
						Request Disclosure
						<span class="material-symbols-outlined text-sm">arrow_forward</span>
					</a>
				</div>
			</section>

			<section>
				<div class="flex items-center gap-2 mb-4 pb-2 border-b border-[#27272a]">
					<span class="material-symbols-outlined text-zinc-400 text-sm">category</span>
					<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Category Breakdown</h3>
				</div>
				{#if isLoadingData}
					<p class="text-sm text-zinc-500">Loading category data...</p>
				{:else if categories.length === 0}
					<p class="text-sm text-zinc-500">{emptyMessage}</p>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{#each categories as [category, data]}
							<div class="bg-[#0d0e15] border border-[#27272a] p-4 rounded flex flex-col gap-4">
								<div class="flex justify-between items-center">
									<span class="font-body-md text-body-md text-white">{formatLabel(category)}</span>
									<span class="font-data-point text-data-point text-zinc-400">{data.transactionCount} tx</span>
								</div>
								<p class="text-xs text-zinc-500">Income {formatCurrency(data.income)} - Expenses {formatCurrency(data.expenses)}</p>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		</main>
	</div>
</div>
