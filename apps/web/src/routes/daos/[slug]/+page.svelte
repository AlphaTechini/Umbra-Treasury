<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getDaoBySlug, getDaoSummary } from '$lib/api/daos';
	import type { Dao, PublicSummary } from '$lib/api/types';
	import { formatCurrency, formatLabel } from '$lib/display';
	import { onMount } from 'svelte';
	import { TrendingUp, TrendingDown, Landmark, Lock, Shield, ArrowRight, LayoutGrid, ExternalLink } from 'lucide-svelte';

	let dao = $state<Dao | null>(null);
	let summary = $state<PublicSummary | null>(null);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading public treasury data...');
	let error = $state<string | null>(null);

	const slug = $derived($page.params.slug);

	onMount(async () => {
		if (!slug) {
			error = 'Invalid DAO URL';
			isLoadingData = false;
			return;
		}

		try {
			const daoResponse = await getDaoBySlug(slug);
			dao = daoResponse.dao;

			if (!dao.isPublic) {
				error = 'This DAO treasury is private';
				isLoadingData = false;
				return;
			}

			const summaryResponse = await getDaoSummary(dao.id);
			summary = summaryResponse.summary;
			emptyMessage = 'No data yet.';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load DAO';
			emptyMessage = error;
		} finally {
			isLoadingData = false;
		}
	});

	const categories = $derived(Object.entries(summary?.categoryBreakdown ?? {}));

	function handleRequestDisclosure() {
		if (dao) {
			goto(`/daos/${dao.slug}/request-disclosure`);
		}
	}
</script>

<svelte:head>
	<title>{dao?.name ?? 'Public Treasury'} – Umbra Treasury</title>
	<meta name="description" content="View public treasury summary and request disclosure for {dao?.name ?? 'this DAO'}" />
</svelte:head>

<div class="min-h-screen bg-[#09090b]">
	<!-- Header -->
	<header class="bg-[#09090b] border-b border-[#27272a] px-6 py-4">
		<div class="max-w-7xl mx-auto flex justify-between items-center">
			<div class="flex items-center gap-4">
				<a href="/" class="text-xl font-bold tracking-tighter text-white hover:text-[#10b981] transition-colors">
					Umbra Treasury
				</a>
				<span class="text-zinc-600">•</span>
				<span class="text-zinc-400">Public View</span>
			</div>
			<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-2 rounded text-sm hover:bg-[#4edea3] transition-colors">
				Owner Login
			</a>
		</div>
	</header>

	<main class="max-w-7xl mx-auto p-6 lg:p-12 space-y-12">
		{#if error}
			<div class="text-center py-12">
				<Lock class="mx-auto text-zinc-600 mb-4" size={48} />
				<h1 class="text-2xl font-bold text-white mb-2">Access Restricted</h1>
				<p class="text-zinc-400 mb-6">{error}</p>
				<a href="/" class="inline-flex items-center gap-2 bg-[#10b981] text-[#002113] font-bold px-6 py-3 rounded-lg hover:bg-[#4edea3] transition-colors">
					Go Home
				</a>
			</div>
		{:else if isLoadingData}
			<div class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981] mb-4"></div>
				<p class="text-zinc-400">Loading treasury data...</p>
			</div>
		{:else}
			<!-- DAO Header -->
			<header class="max-w-3xl">
				<h1 class="font-h1 text-h1 text-white mb-2">{dao?.name ?? 'Umbra Treasury'}</h1>
				<p class="font-body-lg text-body-lg text-zinc-400 mb-4">
					{summary?.privacy.note ?? emptyMessage}
				</p>
				<div class="flex items-center gap-4 text-sm text-zinc-500">
					<span class="flex items-center gap-2">
						<Shield size={16} class="text-[#10b981]" />
						Private by default
					</span>
					<span>•</span>
					<span>{summary?.totals.transactionCount ?? 0} transactions</span>
					<span>•</span>
					<span class="capitalize">{formatLabel(summary?.privacy.source ?? 'summary_only')}</span>
				</div>
			</header>

			<!-- Summary Cards -->
			<section class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col justify-between">
					<div class="flex justify-between items-start mb-6">
						<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Total Income</h3>
						<TrendingUp class="text-[#10b981]" size={20} />
					</div>
					<div class="font-h2 text-h2 text-white">{formatCurrency(summary?.totals.income)}</div>
					<div class="mt-2 text-[#10b981] font-data-point text-data-point">{summary?.dao.baseToken?.toUpperCase() ?? 'USDC'}</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col justify-between">
					<div class="flex justify-between items-start mb-6">
						<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Total Expenses</h3>
						<TrendingDown class="text-red-400" size={20} />
					</div>
					<div class="font-h2 text-h2 text-white">{formatCurrency(summary?.totals.expenses)}</div>
					<div class="mt-2 text-zinc-500 font-data-point text-data-point">{formatLabel(summary?.privacy.source)}</div>
				</div>
				<div class="bg-[#1e1f26] border border-[#10b981]/30 p-6 rounded-lg flex flex-col justify-between relative overflow-hidden">
					<div class="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent pointer-events-none"></div>
					<div class="flex justify-between items-start mb-6 relative z-10">
						<h3 class="font-label-mono text-label-mono text-[#10b981] uppercase">Net Treasury</h3>
						<Landmark class="text-[#10b981]" size={20} />
					</div>
					<div class="font-h2 text-h2 text-[#10b981] relative z-10">{formatCurrency(summary?.totals.net)}</div>
					<div class="mt-2 text-zinc-400 font-data-point text-data-point relative z-10">{formatLabel(summary?.privacy.verificationStatus)}</div>
				</div>
			</section>

			<!-- Privacy Notice & Request Disclosure -->
			<section class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-6 flex flex-col justify-center items-center text-center min-h-[240px]">
					<div class="w-16 h-16 rounded-full bg-[#27272a] flex items-center justify-center mb-4 border border-[#3c4a42]">
						<Lock class="text-white" size={28} />
					</div>
					<h2 class="font-h3 text-h3 text-white mb-2">{summary?.totals.transactionCount ?? 0} Private Transactions</h2>
					<p class="font-body-md text-body-md text-zinc-400">Individual transaction details are encrypted</p>
				</div>
				<div class="flex flex-col justify-center border-l border-[#27272a] pl-12">
					<div class="flex items-center gap-2 mb-4">
						<Shield class="text-[#10b981]" size={20} fill="currentColor" />
						<span class="font-label-mono text-label-mono text-[#10b981] uppercase tracking-widest">Selective Transparency</span>
					</div>
					<p class="font-body-lg text-body-lg text-white mb-6">
						This page shows aggregate summaries only. To access detailed transaction data, submit a disclosure request for DAO owner approval.
					</p>
					<button
						onclick={handleRequestDisclosure}
						class="inline-flex items-center gap-2 bg-[#10b981] text-[#002113] font-bold py-3 px-6 rounded-lg hover:bg-[#4edea3] transition-colors"
					>
						Request Disclosure
						<ArrowRight size={16} />
					</button>
				</div>
			</section>

			<!-- Category Breakdown -->
			<section>
				<div class="flex items-center gap-2 mb-4 pb-2 border-b border-[#27272a]">
					<LayoutGrid class="text-zinc-400" size={16} />
					<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Category Breakdown</h3>
				</div>
				{#if categories.length === 0}
					<p class="text-sm text-zinc-500">{emptyMessage}</p>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{#each categories as [category, data]}
							<div class="bg-[#0d0e15] border border-[#27272a] p-4 rounded flex flex-col gap-4">
								<div class="flex justify-between items-center">
									<span class="font-body-md text-body-md text-white">{formatLabel(category)}</span>
									<span class="font-data-point text-data-point text-zinc-400">{data.transactionCount} tx</span>
								</div>
								<p class="text-xs text-zinc-500">Income {formatCurrency(data.income)} • Expenses {formatCurrency(data.expenses)}</p>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Footer Info -->
			<section class="bg-[#18181b] border border-[#27272a] rounded-lg p-6">
				<h3 class="font-bold text-white mb-3">About This Treasury</h3>
				<p class="text-sm text-zinc-400 mb-4">
					This DAO uses Umbra's privacy infrastructure to keep treasury operations confidential while maintaining accountability through selective disclosure.
				</p>
				<div class="flex flex-wrap gap-4 text-xs text-zinc-500">
					<span>• Encrypted balances on-chain</span>
					<span>• Aggregate summaries public</span>
					<span>• Detailed disclosure on request</span>
					<span>• Cryptographic verification available</span>
				</div>
			</section>
		{/if}
	</main>
</div>
