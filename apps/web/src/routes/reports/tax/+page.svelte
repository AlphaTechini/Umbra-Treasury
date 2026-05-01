<script lang="ts">
	import { getDaoSummary } from '$lib/api/daos';
	import type { PublicSummary } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatCurrency, formatLabel } from '$lib/display';
	import { daoSession } from '$lib/session';
	import { onMount } from 'svelte';

	let summary = $state<PublicSummary | null>(null);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading tax estimate data...');
	let taxRate = $state(15);

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

	const taxableAmount = $derived(Math.max(0, summary?.totals.net ?? 0));
	const estimatedTax = $derived(taxableAmount * (taxRate / 100));
</script>

<svelte:head>
	<title>Tax Estimate - Umbra Treasury</title>
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

		<main class="flex-1 overflow-y-auto p-6 lg:p-12 space-y-6">
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
				<div>
					<nav class="flex text-zinc-500 text-xs mb-2 font-label-mono uppercase tracking-widest">
						<span>Treasury</span>
						<span class="mx-2">/</span>
						<span class="text-[#10b981]">Reports</span>
					</nav>
					<h2 class="font-h2 text-h2 text-white">Tax Estimate</h2>
					<p class="text-zinc-400 font-body-md text-body-md mt-1">{summary?.privacy.note ?? emptyMessage}</p>
				</div>
			</div>

			<div class="flex gap-8 border-b border-[#27272a] overflow-x-auto no-scrollbar">
				<a href="/reports/public" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">Public Summary</a>
				<a href="/reports/auditor" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">Auditor Report</a>
				<div class="pb-4 text-sm font-medium text-[#10b981] relative whitespace-nowrap">
					Tax Estimate
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]"></div>
				</div>
			</div>

			<div class="grid grid-cols-12 gap-6 pt-6">
				<div class="col-span-12 lg:col-span-8 bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col gap-8">
					<div>
						<h3 class="font-h3 text-h3 text-white">{summary?.dao.name ?? 'Taxable Financial Summary'}</h3>
						<p class="text-zinc-400 font-body-md text-body-md mt-1">{formatLabel(summary?.privacy.source)}</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-[#27272a] py-8">
						<div class="flex flex-col gap-2">
							<p class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Total Income</p>
							<p class="font-h2 text-h2 text-white">{isLoadingData ? 'Loading...' : formatCurrency(summary?.totals.income)}</p>
						</div>
						<div class="flex flex-col gap-2">
							<p class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Total Expenses</p>
							<p class="font-h2 text-h2 text-white">{isLoadingData ? 'Loading...' : formatCurrency(summary?.totals.expenses)}</p>
						</div>
						<div class="flex flex-col gap-2">
							<p class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Taxable Amount</p>
							<p class="font-h2 text-h2 text-[#10b981]">{isLoadingData ? 'Loading...' : formatCurrency(taxableAmount)}</p>
						</div>
					</div>

					<div class="flex flex-col md:flex-row md:items-end justify-between pt-4 gap-6">
						<div class="flex flex-col gap-2 w-full md:w-1/3">
							<label class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest" for="tax-rate">Tax Rate Input</label>
							<input
								id="tax-rate"
								class="w-full bg-[#0d0e15] border border-[#27272a] rounded p-3 text-white font-h3 focus:border-white focus:ring-0 transition-colors"
								type="number"
								min="0"
								max="100"
								value={taxRate}
								oninput={(event) => (taxRate = Number(event.currentTarget.value))}
							/>
						</div>
						<div class="bg-[#18181b] border border-[#10b981]/30 p-6 rounded w-full md:w-1/2 flex justify-between items-center">
							<div>
								<p class="font-label-mono text-label-mono text-[#10b981] uppercase tracking-widest">Estimated Tax</p>
								<p class="text-[36px] font-black text-white leading-none mt-1 tracking-tighter">{isLoadingData ? 'Loading...' : formatCurrency(estimatedTax)}</p>
							</div>
							<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
						</div>
					</div>
				</div>

				<div class="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] p-6 rounded-lg">
					<h4 class="font-label-mono text-label-mono text-zinc-400 uppercase tracking-widest mb-4">Compliance Status</h4>
					<div class="flex items-center justify-between p-4 bg-[#0d0e15] border border-[#27272a] rounded">
						<span class="font-body-md text-body-md font-medium text-white">{isLoadingData ? 'Loading...' : formatLabel(summary?.privacy.verificationStatus)}</span>
						<span class="text-xs font-label-mono text-[#10b981]">{summary?.totals.transactionCount ?? 0} TX</span>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
