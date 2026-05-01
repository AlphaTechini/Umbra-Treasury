<script lang="ts">
	import { 
		Share2, 
		Maximize2, 
		FileText, 
		PieChart, 
		LineChart as LucideLineChart,
		ArrowUpRight,
		Users,
		Globe,
		Zap,
		Download
	} from 'lucide-svelte';
	import { getDaoReports } from '$lib/api/reports';
	import type { Report } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatDate, formatLabel } from '$lib/display';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/toasts';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { daoSession } from '$lib/session';

	let mounted = $state(false);
	let reports = $state<Report[]>([]);
	let isLoadingReports = $state(true);
	let reportEmptyMessage = $state('Loading reports...');
	const generateReportAction = 'reports:generate-custom';

	onMount(async () => {
		mounted = true;
		const dao = await daoSession.loadDemoDao();

		if (!dao) {
			reportEmptyMessage = 'No data yet. Connect a wallet or create a DAO treasury to begin.';
			isLoadingReports = false;
			return;
		}

		try {
			const response = await getDaoReports(dao.id);
			reports = response.reports;
			reportEmptyMessage = 'No data yet.';
		} catch (error) {
			reportEmptyMessage = error instanceof Error ? error.message : 'No data yet.';
		} finally {
			isLoadingReports = false;
		}
	});

	async function handleGenerateReport() {
		await runRequestAction(generateReportAction, async () => {
			toasts.add('Compiling data for custom report...', 'info');
			await new Promise(r => setTimeout(r, 2000));
			toasts.add('Custom report generated and archived.', 'success');
		});
	}

	function handleShare() {
		toasts.add('Secure sharing link copied to clipboard.', 'success');
	}
</script>

{#if mounted}
<div class="flex">
	<Sidebar />
	
	<main class="flex-1 ml-64 p-8">
		<header class="flex items-center justify-between mb-10" in:fade>
			<div>
				<h1 class="text-3xl font-bold tracking-tight mb-1">Intelligence Reports</h1>
				<p class="text-zinc-500 text-sm">Deep-dive analytics and automated compliance documentation.</p>
			</div>
			
			<div class="flex items-center gap-3">
				<button 
					onclick={handleShare}
					class="p-2 border border-white/5 bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
					aria-label="Share reports"
				>
					<Share2 size={18} />
				</button>
				<button 
					onclick={handleGenerateReport}
					disabled={$pendingRequestActions[generateReportAction]}
					class="px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded-lg hover:bg-purple-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
				>
					{$pendingRequestActions[generateReportAction] ? 'Generating...' : 'Generate Custom Report'}
				</button>
			</div>
		</header>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
			<div class="glass-card p-6" in:fly={{ y: 20, delay: 200 }}>
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
						<PieChart size={20} />
					</div>
					<h3 class="font-bold">Asset Allocation</h3>
				</div>
				<div class="aspect-square relative flex items-center justify-center">
					<!-- Visual mockup of a donut chart -->
					<div class="w-48 h-48 rounded-full border-[16px] border-zinc-900 relative">
						<div class="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-purple-500 border-r-blue-400 rotate-45"></div>
						<div class="text-center">
							<p class="text-2xl font-bold">$2.4M</p>
							<p class="text-[10px] text-zinc-500 uppercase font-black">Total Assets</p>
						</div>
					</div>
				</div>
				<div class="mt-8 space-y-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-purple-500"></div>
							<span class="text-xs text-zinc-400">Cash Reserves</span>
						</div>
						<span class="text-xs font-bold">64%</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-blue-400"></div>
							<span class="text-xs text-zinc-400">Treasury Bills</span>
						</div>
						<span class="text-xs font-bold">28%</span>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-zinc-700"></div>
							<span class="text-xs text-zinc-400">Crypto Assets</span>
						</div>
						<span class="text-xs font-bold">8%</span>
					</div>
				</div>
			</div>

			<div class="lg:col-span-2 glass-card p-6" in:fly={{ y: 20, delay: 400 }}>
				<div class="flex items-center justify-between mb-8">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
							<LucideLineChart size={20} />
						</div>
						<h3 class="font-bold">Institutional Flow</h3>
					</div>
					<button 
						onclick={() => toasts.add('Expanding view...', 'info')}
						class="p-2 text-zinc-500 hover:text-white transition-colors"
						aria-label="Expand chart"
					>
						<Maximize2 size={16} />
					</button>
				</div>
				
				<!-- Placeholder for chart -->
				<div class="h-64 flex items-end gap-1">
					{#each Array(24) as _, i}
						<button 
							class="flex-1 bg-white/5 rounded-t-sm hover:bg-white/10 transition-all cursor-pointer relative group" 
							style="height: {Math.random() * 80 + 10}%"
							onclick={() => toasts.add(`Value: $${(Math.random() * 50).toFixed(1)}k`)}
							aria-label="View data point {i+1}"
						>
							<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
								${(Math.random() * 50).toFixed(1)}k
							</div>
						</button>
					{/each}
				</div>
				<div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
					<span>Nov 01, 2023</span>
					<span>Flow Intensity: High</span>
					<span>Nov 24, 2023</span>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="glass-card p-6" in:fly={{ y: 20, delay: 600 }}>
				<h3 class="font-bold mb-6">Generated Archives</h3>
				<div class="space-y-4">
					{#if isLoadingReports}
						<p class="text-sm text-zinc-500">Loading reports...</p>
					{:else if reports.length === 0}
						<p class="text-sm text-zinc-500">{reportEmptyMessage}</p>
					{:else}
					{#each reports as report}
						<button 
							class="w-full flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group text-left"
							onclick={() => toasts.add(`Opening ${report.title}...`, 'info')}
						>
							<div class="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
								<FileText size={18} />
							</div>
							<div class="flex-1">
								<p class="text-sm font-semibold">{report.title}</p>
								<p class="text-[10px] text-zinc-500">{formatDate(report.generatedAt)} - {formatLabel(report.source)}</p>
							</div>
							<div class="p-2 text-zinc-600 group-hover:text-white">
								<Download size={16} />
							</div>
						</button>
					{/each}
					{/if}
				</div>
			</div>

			<div class="glass-card p-6 relative overflow-hidden" in:fly={{ y: 20, delay: 800 }}>
				<Zap size={120} class="absolute -right-10 -bottom-10 text-purple-600/10 rotate-12" />
				<h3 class="font-bold mb-2">Automated Insights</h3>
				<p class="text-zinc-500 text-sm mb-8">AI-driven anomalies detected in the current cycle.</p>
				
				<div class="space-y-4 relative z-10">
					<button 
						class="w-full text-left p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors"
						onclick={() => toasts.add('Executing reallocation strategy...', 'info')}
					>
						<div class="flex items-center gap-2 mb-1">
							<ArrowUpRight size={14} class="text-emerald-400" />
							<span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Opportunity</span>
						</div>
						<p class="text-sm font-medium">Reallocation of $1.2M idle cash to T-Bills could yield an additional 4.2% APY based on current rates.</p>
					</button>
					<button 
						class="w-full text-left p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 transition-colors"
						onclick={() => toasts.add('Hedging terminal opened.', 'info')}
					>
						<div class="flex items-center gap-2 mb-1">
							<Globe size={14} class="text-blue-400" />
							<span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Market Drift</span>
						</div>
						<p class="text-sm font-medium">USD/EUR volatility predicted to increase by 15% next week. Consider hedging foreign receivables.</p>
					</button>
				</div>
			</div>
		</div>
	</main>
</div>
{/if}
