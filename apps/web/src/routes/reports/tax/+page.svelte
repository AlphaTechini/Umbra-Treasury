<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Tax Estimate – Umbra Treasury</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center gap-8">
				<span class="text-xl font-bold tracking-tighter text-white">Umbra Treasury</span>
			</div>
			<div class="flex items-center gap-4">
				<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
					Connect Wallet
				</a>
			</div>
		</header>

		<main class="flex-1 overflow-y-auto p-6 lg:p-12 space-y-6">
			<!-- Breadcrumbs & Header -->
			<div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
				<div>
					<nav class="flex text-zinc-500 text-xs mb-2 font-label-mono uppercase tracking-widest">
						<span>Treasury</span>
						<span class="mx-2">/</span>
						<span class="text-[#10b981]">Reports</span>
					</nav>
					<h2 class="font-h2 text-h2 text-white">Financial Overview</h2>
				</div>
			</div>

			<!-- Tab Navigation -->
			<div class="flex gap-8 border-b border-[#27272a] overflow-x-auto no-scrollbar">
				<a href="/reports/public" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">
					Public Summary
				</a>
				<a href="/reports/auditor" class="pb-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap">
					Auditor Report
				</a>
				<div class="pb-4 text-sm font-medium text-[#10b981] relative whitespace-nowrap">
					Tax Estimate
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10b981]"></div>
				</div>
			</div>

			<!-- Content Grid -->
			<div class="grid grid-cols-12 gap-6 pt-6">
				<!-- Primary Financial Summary -->
				<div class="col-span-12 lg:col-span-8 bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col gap-8">
					<div class="flex justify-between items-start">
						<div>
							<h3 class="font-h3 text-h3 text-white">Taxable Financial Summary</h3>
							<p class="text-zinc-400 font-body-md text-body-md mt-1">Fiscal Year 2024 (Q1-Q3 projections)</p>
						</div>
						<button class="bg-[#10b981] text-[#002113] px-6 py-2 rounded font-bold text-sm tracking-tight flex items-center gap-2 hover:bg-[#4edea3] transition-colors">
							<span class="material-symbols-outlined text-[20px]">file_download</span>
							<span>Export Report</span>
						</button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-[#27272a] py-8">
						<div class="flex flex-col gap-2">
							<p class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Total Income</p>
							<p class="font-h2 text-h2 text-white">$142,850</p>
							<div class="flex items-center gap-2">
								<span class="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
								<span class="text-xs text-[#10b981]">+12.4% from last period</span>
							</div>
						</div>
						<div class="flex flex-col gap-2">
							<p class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Total Expenses</p>
							<p class="font-h2 text-h2 text-white">$48,220</p>
							<div class="flex items-center gap-2">
								<span class="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
								<span class="text-xs text-zinc-400">85 transactions processed</span>
							</div>
						</div>
						<div class="flex flex-col gap-2">
							<p class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Taxable Amount</p>
							<p class="font-h2 text-h2 text-[#10b981]">$94,630</p>
							<div class="flex items-center gap-2">
								<span class="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
								<span class="text-xs text-[#10b981]">Net Treasury Growth</span>
							</div>
						</div>
					</div>

					<div class="flex flex-col md:flex-row md:items-end justify-between pt-4 gap-6">
						<div class="flex flex-col gap-2 w-full md:w-1/3">
							<label class="font-label-mono text-label-mono text-zinc-500 uppercase tracking-widest">Tax Rate Input</label>
							<div class="relative">
								<input class="w-full bg-[#0d0e15] border border-[#27272a] rounded p-3 text-white font-h3 focus:border-white focus:ring-0 transition-colors" type="text" value="15%"/>
								<div class="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
									<button class="p-1 hover:text-[#10b981] text-zinc-400"><span class="material-symbols-outlined text-[18px]">add_circle</span></button>
									<button class="p-1 hover:text-[#10b981] text-zinc-400"><span class="material-symbols-outlined text-[18px]">do_not_disturb_on</span></button>
								</div>
							</div>
						</div>
						<div class="bg-[#18181b] border border-[#10b981]/30 p-6 rounded w-full md:w-1/2 flex justify-between items-center">
							<div>
								<p class="font-label-mono text-label-mono text-[#10b981] uppercase tracking-widest">Estimated Tax</p>
								<p class="text-[36px] font-black text-white leading-none mt-1 tracking-tighter">$14,194</p>
							</div>
							<div class="w-12 h-12 rounded-full border-4 border-[#10b981] flex items-center justify-center">
								<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Secondary Insights Column -->
				<div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
					<div class="bg-[#18181b] border border-[#27272a] p-6 rounded-lg">
						<h4 class="font-label-mono text-label-mono text-zinc-400 uppercase tracking-widest mb-4">Compliance Status</h4>
						<div class="flex flex-col gap-4">
							<div class="flex items-center justify-between p-4 bg-[#0d0e15] border border-[#27272a] rounded">
								<div class="flex items-center gap-3">
									<span class="w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
									<span class="font-body-md text-body-md font-medium text-white">IRS Form 1099-NEC</span>
								</div>
								<span class="text-xs font-label-mono text-[#10b981]">READY</span>
							</div>
							<div class="flex items-center justify-between p-4 bg-[#0d0e15] border border-[#27272a] rounded">
								<div class="flex items-center gap-3">
									<span class="w-2 h-2 bg-[#10b981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
									<span class="font-body-md text-body-md font-medium text-white">Crypto Assets Basis</span>
								</div>
								<span class="text-xs font-label-mono text-[#10b981]">SYNCED</span>
							</div>
							<div class="flex items-center justify-between p-4 bg-[#0d0e15] border border-[#27272a] rounded">
								<div class="flex items-center gap-3">
									<span class="w-2 h-2 bg-zinc-600 rounded-full"></span>
									<span class="font-body-md text-body-md font-medium text-white">Auditor Verification</span>
								</div>
								<span class="text-xs font-label-mono text-zinc-500">PENDING</span>
							</div>
						</div>
					</div>

					<!-- Automated Filing CTA -->
					<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-6 relative overflow-hidden flex flex-col gap-4">
						<div class="absolute inset-0 bg-gradient-to-t from-[#10b981]/10 to-transparent opacity-50 pointer-events-none"></div>
						<h4 class="font-h3 text-h3 text-white relative z-10">Automated Filing</h4>
						<p class="text-zinc-400 font-body-md text-body-md relative z-10">Connect your legal entity to automate quarterly tax provisions directly from the treasury.</p>
						<button class="w-full py-2 bg-transparent border border-[#10b981] text-[#10b981] font-bold rounded uppercase text-[10px] tracking-widest hover:bg-[#10b981] hover:text-[#002113] transition-all relative z-10">
							Configure Entity
						</button>
					</div>
				</div>

				<!-- Recent Ledger Entries -->
				<div class="col-span-12 bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
					<div class="px-6 py-4 border-b border-[#27272a] flex justify-between items-center bg-[#0d0e15]">
						<h4 class="font-label-mono text-label-mono text-zinc-400 uppercase tracking-widest">Recent Taxable Ledger</h4>
						<button class="text-xs text-[#10b981] hover:underline">View All Entries</button>
					</div>
					<div class="overflow-x-auto">
						<table class="w-full text-left font-body-md border-collapse">
							<thead>
								<tr class="bg-[#09090b] text-zinc-500 font-label-mono text-[10px] uppercase tracking-widest">
									<th class="px-6 py-3 font-medium">Transaction ID</th>
									<th class="px-6 py-3 font-medium">Category</th>
									<th class="px-6 py-3 font-medium">Date</th>
									<th class="px-6 py-3 font-medium">Amount</th>
									<th class="px-6 py-3 font-medium text-right">Basis (USD)</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-[#27272a]">
								<tr class="hover:bg-[#1e1f26] transition-colors">
									<td class="px-6 py-4 font-mono text-zinc-400 text-sm">0x882...a4f2</td>
									<td class="px-6 py-4 text-white text-sm">Protocol Revenue</td>
									<td class="px-6 py-4 text-zinc-500 text-sm">Oct 24, 2024</td>
									<td class="px-6 py-4 text-[#10b981] font-data-point text-data-point">+12.5 ETH</td>
									<td class="px-6 py-4 text-right font-data-point text-data-point text-white">$31,250.00</td>
								</tr>
								<tr class="hover:bg-[#1e1f26] transition-colors">
									<td class="px-6 py-4 font-mono text-zinc-400 text-sm">0x31a...92cc</td>
									<td class="px-6 py-4 text-[#ffb4ab] text-sm">Staking Yield</td>
									<td class="px-6 py-4 text-zinc-500 text-sm">Oct 22, 2024</td>
									<td class="px-6 py-4 text-[#10b981] font-data-point text-data-point">+4.2 ETH</td>
									<td class="px-6 py-4 text-right font-data-point text-data-point text-white">$10,500.00</td>
								</tr>
								<tr class="hover:bg-[#1e1f26] transition-colors">
									<td class="px-6 py-4 font-mono text-zinc-400 text-sm">0xf1e...221b</td>
									<td class="px-6 py-4 text-white text-sm">Operational Expense</td>
									<td class="px-6 py-4 text-zinc-500 text-sm">Oct 20, 2024</td>
									<td class="px-6 py-4 text-[#ffb4ab] font-data-point text-data-point">-2.0 ETH</td>
									<td class="px-6 py-4 text-right font-data-point text-data-point text-zinc-400">($5,000.00)</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</main>
	</div>
</div>
