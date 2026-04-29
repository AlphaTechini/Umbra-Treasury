<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>DAO Treasury Dashboard – Umbra Treasury</title>
	<meta name="description" content="Private DAO treasury management with institutional-grade financial controls and selective disclosure." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<!-- TopAppBar -->
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center flex-1">
				<div class="relative w-full max-w-sm">
					<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">search</span>
					<input
						class="w-full bg-[#18181b] border border-[#27272a] focus:border-zinc-400 focus:ring-0 text-sm py-1.5 pl-10 pr-4 text-zinc-200 rounded-lg transition-colors"
						placeholder="Search transactions..."
						type="text"
					/>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<button class="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b] transition-colors rounded-lg">
					<span class="material-symbols-outlined">notifications</span>
				</button>
				<button class="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b] transition-colors rounded-lg">
					<span class="material-symbols-outlined">settings</span>
				</button>
				<div class="w-px h-6 bg-[#27272a] mx-1"></div>
				<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
					Connect Wallet
				</a>
			</div>
		</header>

		<!-- Main Content -->
		<main class="flex-1 overflow-y-auto p-6 space-y-6">
			<!-- Page Header -->
			<div class="flex items-end justify-between">
				<div>
					<h1 class="font-h2 text-h2 text-white">Treasury Overview</h1>
					<p class="font-body-md text-body-md text-zinc-400 mt-1">Institutional-grade private treasury operations.</p>
				</div>
				<div class="flex gap-2">
					<a href="/transactions/add" class="flex items-center gap-2 bg-white text-black font-bold text-xs px-4 py-2 rounded hover:bg-zinc-200 transition-colors active:scale-[0.98]">
						<span class="material-symbols-outlined text-[16px]">add</span>
						New Transaction
					</a>
				</div>
			</div>

			<!-- KPI Cards -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Treasury Balance</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">account_balance</span>
					</div>
					<div class="font-h2 text-h2 text-white">$9,329,500</div>
					<div class="font-data-point text-data-point text-[#10b981]">+14.2% YTD</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Private Txns</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">lock</span>
					</div>
					<div class="font-h2 text-h2 text-white">142</div>
					<div class="font-data-point text-data-point text-zinc-400">This month</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Pending Reveals</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">visibility</span>
					</div>
					<div class="font-h2 text-h2 text-white">7</div>
					<div class="font-data-point text-data-point text-zinc-400">Awaiting approval</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-5 flex flex-col gap-3">
					<div class="flex items-center justify-between">
						<span class="font-label-mono text-label-mono text-zinc-400 uppercase">Compliance Score</span>
						<span class="material-symbols-outlined text-[#10b981] text-xl">verified_user</span>
					</div>
					<div class="font-h2 text-h2 text-white">99.8%</div>
					<div class="font-data-point text-data-point text-[#10b981]">Verified</div>
				</div>
			</div>

			<!-- Transactions Table -->
			<div class="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
				<div class="px-6 py-4 border-b border-[#27272a] flex items-center justify-between">
					<h2 class="font-h3 text-h3 text-white">Recent Transactions</h2>
					<div class="flex items-center gap-2">
						<div class="flex border border-[#27272a] rounded-lg p-1 bg-[#0d0e15]">
							<button class="px-3 py-1 text-xs font-bold bg-[#10b981] text-black rounded">All</button>
							<button class="px-3 py-1 text-xs font-bold text-zinc-400 hover:text-white rounded transition-colors">Pending</button>
							<button class="px-3 py-1 text-xs font-bold text-zinc-400 hover:text-white rounded transition-colors">Revealed</button>
						</div>
					</div>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead class="bg-[#0d0e15] text-zinc-500 font-label-mono text-[11px] uppercase tracking-widest">
							<tr>
								<th class="px-6 py-4">Transaction ID</th>
								<th class="px-6 py-4">Status</th>
								<th class="px-6 py-4">Amount</th>
								<th class="px-6 py-4">Recipient</th>
								<th class="px-6 py-4">Category</th>
								<th class="px-6 py-4">Date</th>
								<th class="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#27272a]">
							{#each [
								{ id: 'tx_0042...8x9', status: 'Revealed', statusColor: 'bg-[#10b981]', amount: '$45,200.00', recipient: '0x742d...f44e', category: 'Infrastructure', date: 'Oct 24, 2023' },
								{ id: 'tx_9210...2k1', status: 'Encrypted', statusColor: 'bg-zinc-600', amount: '••••••••', recipient: '••••••••••••', category: '••••••••', date: 'Oct 23, 2023' },
								{ id: 'tx_3341...9p2', status: 'Encrypted', statusColor: 'bg-zinc-600', amount: '••••••••', recipient: '••••••••••••', category: '••••••••', date: 'Oct 22, 2023' },
								{ id: 'tx_8812...1a4', status: 'Revealed', statusColor: 'bg-[#10b981]', amount: '$12,100.00', recipient: '0x991c...a22f', category: 'Payroll', date: 'Oct 21, 2023' },
							] as tx}
								<tr class="hover:bg-[#1e1f26] transition-colors">
									<td class="px-6 py-4 font-mono text-xs text-zinc-300">{tx.id}</td>
									<td class="px-6 py-4">
										<div class="flex items-center gap-2">
											<div class="w-1.5 h-1.5 rounded-full {tx.statusColor}"></div>
											<span class="text-xs text-zinc-300">{tx.status}</span>
										</div>
									</td>
									<td class="px-6 py-4 font-data-point text-data-point text-white">{tx.amount}</td>
									<td class="px-6 py-4 font-mono text-xs text-zinc-300">{tx.recipient}</td>
									<td class="px-6 py-4">
										{#if tx.category !== '••••••••'}
											<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981]">{tx.category}</span>
										{:else}
											<span class="text-zinc-600">{tx.category}</span>
										{/if}
									</td>
									<td class="px-6 py-4 text-xs text-zinc-500">{tx.date}</td>
									<td class="px-6 py-4 text-right">
										<a href="/transactions/reveal" class="text-xs text-[#10b981] hover:underline">Reveal</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	</div>
</div>
