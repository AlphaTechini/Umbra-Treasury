<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Auditor Report – Umbra Treasury</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center gap-8">
				<span class="text-xl font-bold tracking-tighter text-white">Umbra Treasury</span>
				<div class="hidden lg:flex items-center bg-[#18181b] rounded-full px-4 py-1.5 border border-[#27272a]">
					<span class="material-symbols-outlined text-zinc-500 mr-2 text-sm">search</span>
					<input class="bg-transparent border-none focus:ring-0 text-zinc-300 w-48 placeholder-zinc-600 h-5 p-0 text-sm outline-none" placeholder="Search transactions..." type="text"/>
				</div>
			</div>
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<button class="p-2 text-zinc-400 hover:bg-[#18181b] transition-colors rounded-lg">
						<span class="material-symbols-outlined">notifications</span>
					</button>
					<button class="p-2 text-zinc-400 hover:bg-[#18181b] transition-colors rounded-lg">
						<span class="material-symbols-outlined">settings</span>
					</button>
				</div>
				<div class="h-6 w-px bg-[#27272a] mx-2"></div>
				<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
					Connect Wallet
				</a>
			</div>
		</header>

		<main class="flex-1 overflow-y-auto p-6 lg:p-12">
			<!-- Breadcrumbs & Header -->
			<div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
				<div>
					<nav class="flex text-zinc-500 text-xs mb-2 font-label-mono uppercase tracking-widest">
						<span>Treasury</span>
						<span class="mx-2">/</span>
						<span class="text-[#10b981]">Reports</span>
					</nav>
					<h2 class="font-h2 text-h2 text-white">Financial Reporting</h2>
				</div>
				<button class="bg-[#10b981] text-[#002113] font-bold text-sm px-6 py-3 rounded hover:bg-[#4edea3] transition-colors flex items-center">
					<span class="material-symbols-outlined mr-2">file_download</span>
					Export Report
				</button>
			</div>

			<!-- Tab Navigation -->
			<div class="flex gap-8 mb-8 border-b border-[#27272a] overflow-x-auto no-scrollbar">
				<a href="/reports/public" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">
					Public Summary
				</a>
				<div class="pb-4 text-sm font-medium text-[#10b981] relative whitespace-nowrap">
					Auditor Report
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]"></div>
				</div>
				<a href="/reports/tax" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">
					Tax Estimate
				</a>
			</div>

			<!-- Auditor Report Content -->
			<div class="grid grid-cols-12 gap-6">
				<!-- Stats Summary -->
				<div class="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] p-6 rounded-lg">
					<h3 class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest mb-4">Total Revealed Volume</h3>
					<div class="flex items-baseline gap-2">
						<span class="font-h2 text-h2 text-white">1,248.50</span>
						<span class="text-[#10b981] font-bold">ETH</span>
					</div>
					<div class="mt-2 flex items-center text-xs text-[#10b981]">
						<span class="material-symbols-outlined text-sm mr-1">trending_up</span>
						<span>+12.4% from last period</span>
					</div>
				</div>
				<div class="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] p-6 rounded-lg">
					<h3 class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest mb-4">Verification Score</h3>
					<div class="flex items-baseline gap-2">
						<span class="font-h2 text-h2 text-white">99.8</span>
						<span class="text-zinc-500 font-bold">%</span>
					</div>
					<div class="mt-4 w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
						<div class="bg-[#10b981] h-full w-[99.8%]"></div>
					</div>
				</div>
				<div class="col-span-12 lg:col-span-4 bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex items-center justify-between">
					<div>
						<h3 class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest mb-2">Status</h3>
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 rounded-full bg-[#10b981]"></div>
							<span class="font-h3 text-h3 text-[#10b981]">Verified</span>
						</div>
					</div>
					<div class="w-16 h-16 rounded-full border-4 border-[#10b981] flex items-center justify-center opacity-50">
						<span class="material-symbols-outlined text-[#10b981] text-3xl">verified</span>
					</div>
				</div>

				<!-- Detailed Table -->
				<div class="col-span-12 bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
					<div class="p-6 border-b border-[#27272a] flex justify-between items-center">
						<h3 class="font-h3 text-h3 text-white">Revealed Transactions</h3>
						<div class="flex gap-2">
							<button class="bg-[#27272a] p-2 rounded hover:bg-zinc-700 transition-colors">
								<span class="material-symbols-outlined text-sm text-zinc-400">filter_list</span>
							</button>
						</div>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full text-left font-body-md border-collapse">
							<thead>
								<tr class="bg-[#0d0e15] border-b border-[#27272a]">
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Date</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Recipient</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Category</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest text-right">Amount</th>
									<th class="px-6 py-4 font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest text-center">Status</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-[#27272a]">
								{#each [
									{ date: 'Oct 24, 2023', recipient: '0x71C...4921', category: 'Dev Ops', amount: '42.00 ETH' },
									{ date: 'Oct 22, 2023', recipient: 'umbra-vault.eth', category: 'Liquidity', amount: '150.25 ETH' },
									{ date: 'Oct 21, 2023', recipient: '0xA14...F29B', category: 'Treasury Swap', amount: '12.00 ETH' },
									{ date: 'Oct 20, 2023', recipient: 'council-safe.eth', category: 'Grant', amount: '5.50 ETH' },
									{ date: 'Oct 19, 2023', recipient: '0x992...3811', category: 'Audit Fee', amount: '24.00 ETH' },
									{ date: 'Oct 18, 2023', recipient: '0x122...E931', category: 'Governance', amount: '2.10 ETH' }
								] as tx}
									<tr class="hover:bg-[#1e1f26] transition-colors">
										<td class="px-6 py-4 text-zinc-400 text-sm">{tx.date}</td>
										<td class="px-6 py-4">
											<div class="flex items-center gap-2">
												<div class="w-6 h-6 rounded bg-[#27272a] flex items-center justify-center">
													<span class="material-symbols-outlined text-[14px] text-zinc-400">account_circle</span>
												</div>
												<span class="font-mono text-sm text-white">{tx.recipient}</span>
											</div>
										</td>
										<td class="px-6 py-4">
											<span class="px-2 py-1 bg-[#27272a] border border-[#3c4a42] rounded text-[10px] uppercase font-bold text-zinc-400">{tx.category}</span>
										</td>
										<td class="px-6 py-4 text-right font-data-point text-data-point text-white">{tx.amount}</td>
										<td class="px-6 py-4 text-center">
											<span class="material-symbols-outlined text-[#10b981] text-xl" style="font-variation-settings: 'FILL' 1;">visibility</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="p-4 border-t border-[#27272a] flex justify-between items-center bg-[#0d0e15]">
						<span class="text-xs text-zinc-500 font-label-mono text-label-mono">Showing 1-6 of 244 transactions</span>
						<div class="flex gap-1">
							<button class="w-8 h-8 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded text-zinc-500 hover:text-white transition-colors">
								<span class="material-symbols-outlined text-sm">chevron_left</span>
							</button>
							<button class="w-8 h-8 flex items-center justify-center bg-[#10b981] border border-[#10b981] rounded text-[#002113] font-bold text-xs">1</button>
							<button class="w-8 h-8 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded text-zinc-400 hover:text-white text-xs">2</button>
							<button class="w-8 h-8 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded text-zinc-400 hover:text-white text-xs">3</button>
							<button class="w-8 h-8 flex items-center justify-center bg-[#18181b] border border-[#27272a] rounded text-zinc-500 hover:text-white transition-colors">
								<span class="material-symbols-outlined text-sm">chevron_right</span>
							</button>
						</div>
					</div>
				</div>
			</div>

			<footer class="text-center text-zinc-600 text-xs font-label-mono text-label-mono uppercase tracking-[0.2em] mt-12">
				© 2024 Umbra Treasury • Cryptographically Secured Reports
			</footer>
		</main>
	</div>
</div>
