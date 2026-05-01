<script lang="ts">
	import { ArrowDown, Download, MoreHorizontal, Plus } from 'lucide-svelte';
	import { getDaoTransactions } from '$lib/api/transactions';
	import type { TreasuryTransaction } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatCurrency, formatDate, formatLabel, shortId } from '$lib/display';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { daoSession } from '$lib/session';
	import { toasts } from '$lib/toasts';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let mounted = $state(false);
	let transactions = $state<TreasuryTransaction[]>([]);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading transactions...');
	const newTransactionAction = 'transactions:new';
	const exportTransactionsAction = 'transactions:export-csv';

	onMount(async () => {
		mounted = true;
		const dao = await daoSession.loadDemoDao();

		if (!dao) {
			emptyMessage = 'No data yet. Connect a wallet or create a DAO treasury to begin.';
			isLoadingData = false;
			return;
		}

		try {
			const response = await getDaoTransactions(dao.id);
			transactions = response.transactions;
			emptyMessage = 'No data yet.';
		} catch (error) {
			emptyMessage = error instanceof Error ? error.message : 'No data yet.';
		} finally {
			isLoadingData = false;
		}
	});

	function getStatusColor(status: string) {
		switch (status) {
			case 'confirmed':
			case 'disclosure_available':
				return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
			case 'pending':
			case 'summary_included':
				return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
			case 'failed':
				return 'text-red-400 bg-red-400/10 border-red-500/20';
			default:
				return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
		}
	}

	async function handleNewTransaction() {
		await runRequestAction(newTransactionAction, async () => {
			toasts.add('Opening secure transaction creation...', 'info');
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toasts.add('Write operations are limited in this preview.', 'warning');
		});
	}

	async function handleExportCSV() {
		await runRequestAction(exportTransactionsAction, async () => {
			if (transactions.length === 0) {
				toasts.add('No transaction data to export yet.', 'warning');
				return;
			}

			const rows = [
				['id', 'type', 'category', 'token', 'amountHint', 'date', 'privacyStatus', 'umbraStatus'],
				...transactions.map((tx) => [
					tx.id,
					tx.type,
					tx.category,
					tx.token,
					tx.amountHint ?? '',
					tx.date,
					tx.privacyStatus,
					tx.umbraStatus
				])
			];
			const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = 'umbra-transactions.csv';
			link.click();
			URL.revokeObjectURL(url);
			toasts.add('Ledger exported to CSV successfully.', 'success');
		});
	}
</script>

{#if mounted}
	<div class="flex">
		<Sidebar />

		<main class="flex-1 ml-64 p-8">
			<header class="flex items-center justify-between mb-8" in:fade>
				<div>
					<h1 class="text-3xl font-bold tracking-tight mb-1 font-sans">Transaction Ledger</h1>
					<p class="text-zinc-500 text-sm">Monitor every financial movement across your treasury.</p>
				</div>

				<div class="flex items-center gap-3">
					<button
						onclick={handleExportCSV}
						disabled={$pendingRequestActions[exportTransactionsAction]}
						class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 hover:border-white/20 rounded-lg text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60"
					>
						<Download size={16} /> {$pendingRequestActions[exportTransactionsAction] ? 'Exporting...' : 'Export CSV'}
					</button>
					<button
						onclick={handleNewTransaction}
						disabled={$pendingRequestActions[newTransactionAction]}
						class="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
					>
						<Plus size={16} /> {$pendingRequestActions[newTransactionAction] ? 'Opening...' : 'New Transaction'}
					</button>
				</div>
			</header>

			<div class="glass-card overflow-hidden" in:fly={{ y: 20, delay: 200 }}>
				<div class="p-4 border-b border-white/5 flex items-center justify-end gap-4">
					<div class="flex items-center gap-2">
						<select class="bg-[#0a0a0a] border border-white/5 rounded-lg px-3 py-2 text-sm focus:outline-none">
							<option>All Statuses</option>
							<option>Confirmed</option>
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
								<th class="px-6 py-4">Reference</th>
								<th class="px-6 py-4">Type</th>
								<th class="px-6 py-4">Category</th>
								<th class="px-6 py-4">Date</th>
								<th class="px-6 py-4">Status</th>
								<th class="px-6 py-4 text-right">Amount</th>
								<th class="px-6 py-4"></th>
							</tr>
						</thead>
						<tbody class="divide-y divide-white/5">
							{#if isLoadingData}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">Loading transactions...</td>
								</tr>
							{:else if transactions.length === 0}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">{emptyMessage}</td>
								</tr>
							{:else}
								{#each transactions as tx, i}
									<tr class="group hover:bg-white/5 transition-colors cursor-pointer" in:fly={{ x: -10, delay: 300 + i * 50 }}>
										<td class="px-6 py-4">
											<span class="text-xs font-mono text-zinc-500">{shortId(tx.id)}</span>
										</td>
										<td class="px-6 py-4">
											<span class="text-sm font-semibold">{formatLabel(tx.type)}</span>
										</td>
										<td class="px-6 py-4">
											<span class="text-xs text-zinc-400">{formatLabel(tx.category)}</span>
										</td>
										<td class="px-6 py-4">
											<span class="text-xs text-zinc-400">{formatDate(tx.date)}</span>
										</td>
										<td class="px-6 py-4">
											<span class="text-[10px] px-2 py-1 rounded-md border font-bold {getStatusColor(tx.umbraStatus)}">
												{formatLabel(tx.umbraStatus)}
											</span>
										</td>
										<td class="px-6 py-4 text-right">
											<span class="text-sm font-bold {tx.type === 'income' ? 'text-emerald-400' : 'text-white'}">
												{formatCurrency(tx.amountHint)}
											</span>
										</td>
										<td class="px-6 py-4 text-right">
											<button class="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-200" aria-label="Open transaction options">
												<MoreHorizontal size={16} />
											</button>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>

				<div class="p-4 border-t border-white/5 flex items-center justify-between">
					<span class="text-xs text-zinc-500 font-medium">Showing {transactions.length} transactions</span>
				</div>
			</div>
		</main>
	</div>
{/if}
