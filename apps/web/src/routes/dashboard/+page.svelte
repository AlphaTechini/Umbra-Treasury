<script lang="ts">
	import { 
		TrendingUp, 
		TrendingDown, 
		Wallet, 
		CreditCard, 
		ArrowUpRight, 
		ArrowDownRight,
		Filter,
		Calendar,
		Sparkles,
		ChevronRight
	} from 'lucide-svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/toasts';
	import { processRequest, isLoading } from '$lib/loading';

	let mounted = $state(false);
	let aiInsights = $state<string[]>([]);
	let isAnalyzing = $state(false);

	onMount(() => {
		mounted = true;
	});

	const stats = [
		{ name: 'Total Balance', value: '$2,481,092.45', change: '+12.5%', isUp: true, icon: Wallet, color: 'text-purple-400' },
		{ name: 'Active Accounts', value: '24', change: '+2', isUp: true, icon: CreditCard, color: 'text-blue-400' },
		{ name: 'Monthly Inflow', value: '$840,291.00', change: '-3.1%', isUp: false, icon: TrendingUp, color: 'text-emerald-400' },
		{ name: 'Expenses', value: '$120,402.12', change: '+8.4%', isUp: true, icon: TrendingDown, color: 'text-rose-400' },
	];

	const recentTransactions = [
		{ id: 1, name: 'Stripe Payout', type: 'Credit', amount: '+$12,400.00', date: 'Oct 24, 2023', status: 'Completed', icon: ArrowDownRight },
		{ id: 2, name: 'AWS Cloud Services', type: 'Debit', amount: '-$3,201.12', date: 'Oct 23, 2023', status: 'Processing', icon: ArrowUpRight },
		{ id: 3, name: 'Vercel Inc', type: 'Debit', amount: '-$402.00', date: 'Oct 22, 2023', status: 'Completed', icon: ArrowUpRight },
		{ id: 4, name: 'Investor A Capital', type: 'Credit', amount: '+$250,000.00', date: 'Oct 21, 2023', status: 'Completed', icon: ArrowDownRight },
	];

	async function handleQuickTransfer() {
		toasts.add('Initiating secure transfer terminal...', 'info');
		await processRequest(async () => {
			await new Promise(r => setTimeout(r, 1500));
		});
		toasts.add('Transfer feature is restricted in preview mode.', 'warning');
	}

	function handleExport() {
		toasts.add('Generating encrypted PDF summary...', 'info');
		setTimeout(() => {
			toasts.add('Summary generated and ready for secure download.', 'success');
		}, 2000);
	}

	async function generateAIInsights() {
		if (isAnalyzing) return;
		isAnalyzing = true;
		toasts.add('Umbra AI Oracle is analyzing your treasury flow...', 'info');
		
		try {
			const res = await fetch('/api/ai/insights', { method: 'POST' });
			const data = await res.json();
			if (data.insights) {
				aiInsights = data.insights;
				toasts.add('Intelligence report compiled successfully.', 'success');
			} else if (data.error) {
				toasts.add(data.error, 'error');
			}
		} catch (e) {
			toasts.add('Oracle connection failed. Using cached intelligence.', 'warning');
			aiInsights = ["Yield optimization suggested for idle USD reserves.", "Volatility dampening observed in major liquidity pools."];
		} finally {
			isAnalyzing = false;
		}
	}
</script>

{#if mounted}
<div class="flex">
	<Sidebar />
	
	<main class="flex-1 ml-64 p-8">
		<header class="flex items-center justify-between mb-10" in:fade>
			<div>
				<h1 class="text-3xl font-bold tracking-tight mb-1">Financial Intelligence</h1>
				<p class="text-zinc-500 text-sm">Welcome back to your treasury console.</p>
			</div>
			
			<div class="flex items-center gap-3">
				<button 
					onclick={() => toasts.add('Calendar filtering is disabled in this view.')}
					class="p-2 border border-white/5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
					aria-label="Filter by date"
				>
					<Calendar size={18} />
				</button>
				<button 
					onclick={() => toasts.add('Advanced filters are coming in v2.1')}
					class="p-2 border border-white/5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
					aria-label="Advanced filters"
				>
					<Filter size={18} />
				</button>
				<button 
					onclick={handleQuickTransfer}
					class="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
				>
					Quick Transfer
				</button>
			</div>
		</header>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
			{#each stats as stat, i}
				<div 
					class="glass-card p-5 group hover:border-white/20 transition-all cursor-default"
					in:fly={{ y: 20, delay: i * 100 }}
				>
					<div class="flex items-center justify-between mb-4">
						<div class="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
							<stat.icon size={20} class={stat.color} />
						</div>
						<span class="text-xs font-bold {stat.isUp ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1">
							{stat.change}
							{#if stat.isUp}
								<ArrowUpRight size={12} />
							{:else}
								<ArrowDownRight size={12} />
							{/if}
						</span>
					</div>
					<div class="space-y-1">
						<p class="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.name}</p>
						<p class="text-2xl font-bold tracking-tight">{stat.value}</p>
					</div>
				</div>
			{/each}
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div class="lg:col-span-2 glass-card p-6" in:fly={{ y: 20, delay: 500 }}>
				<div class="flex items-center justify-between mb-8">
					<div>
						<h3 class="text-lg font-bold">Inflow vs Outflow</h3>
						<p class="text-zinc-500 text-xs">Activity overview for the last 30 days</p>
					</div>
					<div class="flex items-center gap-3 bg-white/5 p-1 rounded-lg border border-white/5">
						<button class="px-3 py-1 text-xs font-bold rounded-md bg-white/10 text-white">Month</button>
						<button class="px-3 py-1 text-xs font-bold rounded-md text-zinc-500 hover:text-white transition-colors">Year</button>
					</div>
				</div>
				
				<!-- Placeholder for a chart -->
				<div class="h-64 flex items-end justify-between gap-2 px-2">
					{#each Array(12) as _, i}
						<div class="flex-1 flex flex-col items-center gap-2 group">
							<div class="w-full bg-white/5 rounded-full overflow-hidden flex flex-col justify-end transition-all group-hover:bg-white/10" style="height: 100%">
								<div 
									class="w-full bg-gradient-to-t from-purple-500/40 to-purple-400 rounded-t-full transition-all group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
									style="height: {Math.random() * 70 + 20}%"
								></div>
							</div>
							<span class="text-[10px] text-zinc-600 font-bold group-hover:text-zinc-400">M{i+1}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="glass-card p-6" in:fly={{ y: 20, delay: 600 }}>
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-lg font-bold">Recent History</h3>
					<button 
						onclick={() => toasts.add('Redirecting to full ledger...', 'info')}
						class="text-xs font-bold text-purple-400 hover:text-purple-300"
					>
						View all
					</button>
				</div>

				<div class="space-y-5">
					{#each recentTransactions as tx}
						<button 
							class="w-full flex items-center gap-4 group text-left transition-all" 
							onclick={() => toasts.add(`Details for ${tx.name}`)}
						>
							<div class="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:border-white/20 transition-all">
								<tx.icon size={18} />
							</div>
							<div class="flex-1">
								<p class="text-sm font-semibold truncate">{tx.name}</p>
								<p class="text-xs text-zinc-500">{tx.date}</p>
							</div>
							<div class="text-right">
								<p class="text-sm font-bold {tx.type === 'Credit' ? 'text-emerald-400' : 'text-zinc-300'}">{tx.amount}</p>
								<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-zinc-500">{tx.status}</span>
							</div>
						</button>
					{/each}
				</div>

				<div class="mt-8 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl relative overflow-hidden group">
					<div class="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
					<h4 class="text-sm font-bold mb-1 relative z-10">Export Summary</h4>
					<p class="text-xs text-zinc-400 mb-3 relative z-10 leading-relaxed">Generate a comprehensive audit trail for the fiscal period.</p>
					<button 
						onclick={handleExport}
						class="w-full py-2 bg-purple-500 text-white text-xs font-bold rounded-lg hover:bg-purple-400 transition-colors relative z-10"
					>
						Download PDF
					</button>
				</div>
			</div>
		</div>

		<!-- AI Oracle Section -->
		<div class="mt-8 glass-card p-6 bg-gradient-to-br from-purple-900/10 to-blue-900/10 relative overflow-hidden group border-purple-500/20" in:fly={{ y: 20, delay: 700 }}>
			<div class="flex flex-col gap-6 relative z-10">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
							<Sparkles size={24} class={isAnalyzing ? 'animate-pulse' : ''} />
						</div>
						<div>
							<h3 class="text-xl font-bold">Umbra AI Oracle</h3>
							<p class="text-sm text-zinc-400">Strategic intelligence derived from treasury movements.</p>
						</div>
					</div>
					<button 
						onclick={generateAIInsights}
						disabled={isAnalyzing}
						class="px-6 py-2.5 bg-white text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
					>
						{isAnalyzing ? 'Synthesizing...' : 'Generate New Insights'}
					</button>
				</div>

				{#if aiInsights.length > 0}
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4" transition:slide>
						{#each aiInsights as insight, i}
							<button 
								class="text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group/insight"
								in:fly={{ y: 10, delay: i * 100 }}
								onclick={() => toasts.add(`Analyzing strategy...`)}
							>
								<div class="flex items-center gap-2 mb-2">
									<div class="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
									<span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Oracle Insight {i+1}</span>
								</div>
								<p class="text-sm font-medium text-zinc-200 leading-relaxed">{insight}</p>
								<div class="mt-3 flex items-center gap-1 text-[10px] font-bold text-purple-400 opacity-0 group-hover/insight:opacity-100 transition-opacity">
									Execute Strategy <ChevronRight size={10} />
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
			
			<div class="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
		</div>
	</main>
</div>
{/if}
