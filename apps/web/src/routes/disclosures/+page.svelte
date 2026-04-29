<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Disclosure Requests – Umbra Treasury</title>
	<meta name="description" content="Manage transaction disclosure requests." />
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
						placeholder="Search requests..."
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

		<main class="flex-1 overflow-y-auto p-6 space-y-6">
			<div class="flex items-end justify-between">
				<div>
					<h1 class="font-h2 text-h2 text-white">Disclosure Requests</h1>
					<p class="font-body-md text-body-md text-zinc-400 mt-1">Manage external requests for private transaction data.</p>
				</div>
				<div class="flex gap-2 border border-[#27272a] rounded-lg p-1 bg-[#0d0e15]">
					<button class="px-4 py-1.5 text-xs font-bold bg-zinc-800 text-white rounded transition-colors">Pending</button>
					<button class="px-4 py-1.5 text-xs font-bold text-zinc-400 hover:text-white rounded transition-colors">Resolved</button>
					<button class="px-4 py-1.5 text-xs font-bold text-zinc-400 hover:text-white rounded transition-colors">Rejected</button>
				</div>
			</div>

			<div class="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead class="bg-[#0d0e15] text-zinc-500 font-label-mono text-[11px] uppercase tracking-widest">
							<tr>
								<th class="px-6 py-4">Request ID</th>
								<th class="px-6 py-4">Requestor</th>
								<th class="px-6 py-4">Target</th>
								<th class="px-6 py-4">Reason</th>
								<th class="px-6 py-4">Date</th>
								<th class="px-6 py-4 text-center">Status</th>
								<th class="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#27272a]">
							{#each [
								{ id: 'req_0912', req: 'Deloitte Audit', target: 'Q3 Financials', reason: 'Annual Audit', date: 'Oct 25, 2023', status: 'Pending', statusColor: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' },
								{ id: 'req_0911', req: 'IRS Compliance', target: 'tx_0042...8x9', reason: 'Tax Reporting', date: 'Oct 24, 2023', status: 'Resolved', statusColor: 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30' },
								{ id: 'req_0910', req: 'DAO Member', target: 'Grants Sub-DAO', reason: 'Transparency', date: 'Oct 20, 2023', status: 'Rejected', statusColor: 'bg-red-500/20 text-red-500 border-red-500/30' },
							] as req}
								<tr class="hover:bg-[#1e1f26] transition-colors">
									<td class="px-6 py-4 font-mono text-xs text-zinc-300">{req.id}</td>
									<td class="px-6 py-4 text-sm text-zinc-200">{req.req}</td>
									<td class="px-6 py-4 font-mono text-xs text-zinc-400">{req.target}</td>
									<td class="px-6 py-4 text-sm text-zinc-400">{req.reason}</td>
									<td class="px-6 py-4 text-xs text-zinc-500">{req.date}</td>
									<td class="px-6 py-4 text-center">
										<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border {req.statusColor}">{req.status}</span>
									</td>
									<td class="px-6 py-4 text-right">
										{#if req.status === 'Pending'}
											<div class="flex items-center justify-end gap-2">
												<button class="text-xs text-[#10b981] hover:underline font-bold">Approve</button>
												<button class="text-xs text-red-500 hover:underline font-bold">Reject</button>
											</div>
										{:else}
											<button class="text-xs text-zinc-500 hover:text-zinc-300">View</button>
										{/if}
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
