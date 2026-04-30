<script lang="ts">
	import { 
		ArrowDown, 
		Download, 
		Plus, 
		MoreHorizontal
	} from 'lucide-svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/toasts';
	import { processRequest } from '$lib/loading';

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const transactions = [
		{ id: 'TX-9021', name: 'OpenAI API subscription', category: 'Software', date: 'Oct 24, 2023', amount: -240.00, status: 'Completed', logo: 'O' },
		{ id: 'TX-9020', name: 'Global Equity Fund Init', category: 'Investment', date: 'Oct 24, 2023', amount: 350000.00, status: 'Pending', logo: 'G' },
		{ id: 'TX-9019', name: 'Manning & Co. Legal', category: 'Professional', date: 'Oct 23, 2023', amount: -4500.00, status: 'Completed', logo: 'M' },
		{ id: 'TX-9018', name: 'Apple Enterprise', category: 'Hardware', date: 'Oct 22, 2023', amount: -12199.99, status: 'Completed', logo: 'A' },
		{ id: 'TX-9017', name: 'Cloudflare Workers', category: 'Infrastructure', date: 'Oct 21, 2023', amount: -20.00, status: 'Completed', logo: 'C' },
		{ id: 'TX-9016', name: 'Stripe Merchant Payout', category: 'Revenue', date: 'Oct 20, 2023', amount: 42100.45, status: 'Completed', logo: 'S' },
		{ id: 'TX-9015', name: 'Amazon Web Services', category: 'Infrastructure', date: 'Oct 20, 2023', amount: -6502.12, status: 'Processing', logo: 'A' },
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'Completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
			case 'Pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
			case 'Processing': return 'text-blue-400 bg-blue-400/10 border-blue-500/20';
			default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
		}
	}

	async function handleNewTransaction() {
		toasts.add('Opening secure transaction creation...', 'info');
		await processRequest(async () => {
			await new Promise(r => setTimeout(r, 1000));
		});
		toasts.add('Write operations are limited in this preview.', 'warning');
	}

	function handleExportCSV() {
		toasts.add('Ledger exported to CSV successfully.', 'success');
	}
</script>

{#if mounted}
<div class="flex">
	<Sidebar />
	
	<main class="flex-1 ml-64 p-8">
		<header class="flex items-center justify-between mb-8" in:fade>
			<div>
				<h1 class="text-3xl font-bold tracking-tight mb-1 font-sans">Transaction Ledger</h1>
				<p class="text-zinc-500 text-sm">Monitor every financial movement across your global ecosystem.</p>
			</div>
			
			<div class="flex items-center gap-3">
				<button 
					onclick={handleExportCSV}
					class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 hover:border-white/20 rounded-lg text-sm font-bold transition-all"
				>
					<Download size={16} /> Export CSV
				</button>
				<button 
					onclick={handleNewTransaction}
					class="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
				>
					<Plus size={16} /> New Transaction
				</button>
			</div>
		</header>

		<div class="glass-card overflow-hidden" in:fly={{ y: 20, delay: 200 }}>
			<div class="p-4 border-b border-white/5 flex items-center justify-end gap-4">
				<div class="flex items-center gap-2">
					<select class="bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none">
						<option>All Statuses</option>
						<option>Completed</option>
						<option>Pending</option>
					</select>
					<button class="p-2 border border-white/5 bg-white/5 rounded-lg text-zinc-400">
						<ArrowDown size={18} />
					</button>
				</div>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-white/5">
							<th class="px-6 py-4">Beneficiary / Source</th>
							<th class="px-6 py-4">Reference</th>
							<th class="px-6 py-4">Category</th>
							<th class="px-6 py-4">Date</th>
							<th class="px-6 py-4">Status</th>
							<th class="px-6 py-4 text-right">Amount</th>
							<th class="px-6 py-4"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-white/5">
						{#each transactions as tx, i}
							<tr 
								class="group hover:bg-white/5 transition-colors cursor-pointer" 
								in:fly={{ x: -10, delay: 300 + (i * 50) }}
								onclick={() => toasts.add(`Transaction ${tx.id} selected.`)}
							>
								<td class="px-6 py-4">
									<div class="flex items-center gap-3">
										<div class="w-8 h-8 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs uppercase">
											{tx.logo}
										</div>
										<span class="text-sm font-semibold">{tx.name}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<span class="text-xs font-mono text-zinc-500">{tx.id}</span>
								</td>
								<td class="px-6 py-4">
									<span class="text-xs text-zinc-400">{tx.category}</span>
								</td>
								<td class="px-6 py-4">
									<span class="text-xs text-zinc-400">{tx.date}</span>
								</td>
								<td class="px-6 py-4">
									<span class="text-[10px] px-2 py-1 rounded-md border font-bold {getStatusColor(tx.status)}">
										{tx.status}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<span class="text-sm font-bold {tx.amount > 0 ? 'text-emerald-400' : 'text-white'}">
										{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
									</span>
								</td>
								<td class="px-6 py-4 text-right">
									<button 
										onclick={(e) => {
											e.stopPropagation();
											toasts.add('Options menu is restricted.');
										}}
										class="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-200"
									>
										<MoreHorizontal size={16} />
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="p-4 border-t border-white/5 flex items-center justify-between">
				<span class="text-xs text-zinc-500 font-medium">Showing 7 of 1,248 transactions</span>
				<div class="flex items-center gap-2">
					<button class="px-3 py-1 bg-white/5 border border-white/5 rounded-md text-xs font-bold hover:bg-white/10 disabled:opacity-50" disabled>Previous</button>
					<button 
						onclick={() => toasts.add('Loading more transactions...')}
						class="px-3 py-1 bg-white/5 border border-white/5 rounded-md text-xs font-bold hover:bg-white/10"
					>Next</button>
				</div>
			</div>
		</div>
	</main>
</div>
{/if}
