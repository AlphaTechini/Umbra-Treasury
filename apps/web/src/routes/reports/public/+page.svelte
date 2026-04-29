<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Public Treasury View – Umbra Treasury</title>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center gap-8">
				<span class="text-xl font-bold tracking-tighter text-white">Public Treasury</span>
				<div class="hidden lg:flex items-center bg-[#18181b] rounded-full px-4 py-1.5 border border-[#27272a]">
					<span class="material-symbols-outlined text-zinc-500 mr-2 text-sm">search</span>
					<input class="bg-transparent border-none focus:ring-0 text-zinc-300 w-48 placeholder-zinc-600 h-5 p-0 text-sm outline-none" placeholder="Search reports..." type="text"/>
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

		<main class="flex-1 overflow-y-auto p-6 lg:p-12 space-y-12">
			<!-- Header Section -->
			<header class="max-w-3xl">
				<h1 class="font-h1 text-h1 text-white mb-2">Umbra Treasury</h1>
				<p class="font-body-lg text-body-lg text-zinc-400">
					Institutional-grade private treasury management for decentralized organizations.
				</p>
			</header>

			<!-- Financial Summary Bento Grid -->
			<section class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col justify-between">
					<div class="flex justify-between items-start mb-6">
						<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Total Income</h3>
						<span class="material-symbols-outlined text-[#10b981]">arrow_upward</span>
					</div>
					<div class="font-h2 text-h2 text-white">$12,450,000</div>
					<div class="mt-2 text-[#10b981] font-data-point text-data-point">+14.2% YTD</div>
				</div>
				<div class="bg-[#18181b] border border-[#27272a] p-6 rounded-lg flex flex-col justify-between">
					<div class="flex justify-between items-start mb-6">
						<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Total Expenses</h3>
						<span class="material-symbols-outlined text-red-400">arrow_downward</span>
					</div>
					<div class="font-h2 text-h2 text-white">$3,120,500</div>
					<div class="mt-2 text-zinc-500 font-data-point text-data-point">Protected Ledger</div>
				</div>
				<div class="bg-[#1e1f26] border border-[#10b981]/30 p-6 rounded-lg flex flex-col justify-between relative overflow-hidden">
					<div class="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent pointer-events-none"></div>
					<div class="flex justify-between items-start mb-6 relative z-10">
						<h3 class="font-label-mono text-label-mono text-[#10b981] uppercase">Net Treasury</h3>
						<span class="material-symbols-outlined text-[#10b981]">account_balance</span>
					</div>
					<div class="font-h2 text-h2 text-[#10b981] relative z-10">$9,329,500</div>
					<div class="mt-2 text-zinc-400 font-data-point text-data-point relative z-10">Total AUM</div>
				</div>
			</section>

			<!-- Privacy Notice & Transaction Summary -->
			<section class="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<div class="bg-[#18181b] border border-[#27272a] rounded-lg p-6 flex flex-col justify-center items-center text-center min-h-[240px]">
					<div class="w-16 h-16 rounded-full bg-[#27272a] flex items-center justify-center mb-4 border border-[#3c4a42]">
						<span class="material-symbols-outlined text-white text-3xl">lock</span>
					</div>
					<h2 class="font-h3 text-h3 text-white mb-2">142 Private Transactions</h2>
					<p class="font-body-md text-body-md text-zinc-400">This Month</p>
				</div>
				<div class="flex flex-col justify-center border-l border-[#27272a] pl-12">
					<div class="flex items-center gap-2 mb-4">
						<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">shield</span>
						<span class="font-label-mono text-label-mono text-[#10b981] uppercase tracking-widest">Privacy Preserved</span>
					</div>
					<p class="font-body-lg text-body-lg text-white mb-6">
						Detailed transactions are private to protect the organization's strategic capital. Ledger visibility is strictly controlled.
					</p>
					<div>
						<a href="/disclosures/request" class="inline-flex items-center gap-2 bg-transparent border border-[#27272a] text-white font-data-point text-data-point py-2 px-6 rounded hover:bg-[#18181b] transition-colors">
							Request Disclosure
							<span class="material-symbols-outlined text-sm">arrow_forward</span>
						</a>
					</div>
				</div>
			</section>

			<!-- Category Breakdown Grid -->
			<section>
				<div class="flex items-center gap-2 mb-4 pb-2 border-b border-[#27272a]">
					<span class="material-symbols-outlined text-zinc-400 text-sm">category</span>
					<h3 class="font-label-mono text-label-mono text-zinc-400 uppercase">Expense Allocation Breakdown</h3>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{#each [
						{ name: 'Payroll', value: '45%', w: 'w-[45%]', color: 'bg-[#10b981]' },
						{ name: 'Grants', value: '30%', w: 'w-[30%]', color: 'bg-[#10b981]/70' },
						{ name: 'Vendors', value: '15%', w: 'w-[15%]', color: 'bg-[#10b981]/50' },
						{ name: 'Operations', value: '10%', w: 'w-[10%]', color: 'bg-[#10b981]/30' },
					] as cat}
						<div class="bg-[#0d0e15] border border-[#27272a] p-4 rounded flex flex-col gap-4">
							<div class="flex justify-between items-center">
								<span class="font-body-md text-body-md text-white">{cat.name}</span>
								<span class="font-data-point text-data-point text-zinc-400">{cat.value}</span>
							</div>
							<div class="w-full bg-[#27272a] h-1 rounded-full overflow-hidden">
								<div class="h-full {cat.w} {cat.color}"></div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		</main>
	</div>
</div>
