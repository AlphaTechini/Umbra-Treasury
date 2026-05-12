<script lang="ts">
	import { getDisclosureRequestsByWallet } from '$lib/api/disclosures';
	import type { DisclosureRequest } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatDate, formatLabel, shortId } from '$lib/display';
	import { walletSession } from '$lib/session';
	import { onMount } from 'svelte';

	let disclosureRequests = $state<DisclosureRequest[]>([]);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading your disclosure requests...');
	let requestFilter = $state<'pending' | 'approved' | 'rejected'>('pending');
	
	const wallet = $derived($walletSession);
	
	const visibleDisclosureRequests = $derived(
		disclosureRequests.filter((request) => {
			if (requestFilter === 'approved') {
				return request.status === 'approved' || request.status === 'fulfilled';
			}

			return request.status === requestFilter;
		})
	);

	onMount(async () => {
		if (wallet.status !== 'connected' || !wallet.walletAddress) {
			emptyMessage = 'Connect your wallet to view your disclosure requests.';
			isLoadingData = false;
			return;
		}

		try {
			const response = await getDisclosureRequestsByWallet(wallet.walletAddress);
			disclosureRequests = response.disclosureRequests;
			
			// If no requests, redirect to public DAO page to make first request
			if (disclosureRequests.length === 0) {
				emptyMessage = 'No disclosure requests yet. Visit a DAO page to request access.';
			} else {
				emptyMessage = 'No disclosure requests yet.';
			}
		} catch (error) {
			emptyMessage = error instanceof Error ? error.message : 'Failed to load requests.';
		} finally {
			isLoadingData = false;
		}
	});

	function getStatusColor(status: string) {
		switch (status) {
			case 'approved':
			case 'fulfilled':
				return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
			case 'rejected':
				return 'bg-red-500/20 text-red-500 border-red-500/30';
			default:
				return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
		}
	}

	function shortAddress(address: string) {
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	}
</script>

<svelte:head>
	<title>My Disclosure Requests - Umbra Treasury</title>
	<meta name="description" content="View your disclosure requests and approved reports." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center flex-1"></div>
			<div class="flex items-center gap-3">
				{#if wallet.status === 'connected' && wallet.walletAddress}
					<div class="flex items-center gap-2 bg-[#18181b] border border-[#27272a] px-4 py-1.5 rounded">
						<span class="text-[#10b981] text-xs font-mono">{shortAddress(wallet.walletAddress)}</span>
					</div>
				{:else}
					<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
						Connect Wallet
					</a>
				{/if}
			</div>
		</header>

		<main class="flex-1 overflow-y-auto p-6 space-y-6">
			<div class="flex items-end justify-between">
				<div>
					<h1 class="font-h2 text-h2 text-white">My Disclosure Requests</h1>
					<p class="font-body-md text-body-md text-zinc-400 mt-1">Track your requests for private transaction data.</p>
				</div>
				<div class="flex gap-2 border border-[#27272a] rounded-lg p-1 bg-[#0d0e15]">
					<button onclick={() => (requestFilter = 'pending')} class="px-4 py-1.5 text-xs font-bold {requestFilter === 'pending' ? 'bg-[#10b981] text-[#002113]' : 'text-zinc-400 hover:text-white'} rounded transition-colors">Pending</button>
					<button onclick={() => (requestFilter = 'approved')} class="px-4 py-1.5 text-xs font-bold {requestFilter === 'approved' ? 'bg-[#10b981] text-[#002113]' : 'text-zinc-400 hover:text-white'} rounded transition-colors">Approved</button>
					<button onclick={() => (requestFilter = 'rejected')} class="px-4 py-1.5 text-xs font-bold {requestFilter === 'rejected' ? 'bg-[#10b981] text-[#002113]' : 'text-zinc-400 hover:text-white'} rounded transition-colors">Rejected</button>
				</div>
			</div>

			<div class="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead class="bg-[#0d0e15] text-zinc-500 font-label-mono text-[11px] uppercase tracking-widest">
							<tr>
								<th class="px-6 py-4">Request ID</th>
								<th class="px-6 py-4">DAO</th>
								<th class="px-6 py-4">Scope</th>
								<th class="px-6 py-4">Reason</th>
								<th class="px-6 py-4">Date</th>
								<th class="px-6 py-4 text-center">Status</th>
								<th class="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[#27272a]">
							{#if isLoadingData}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">Loading your disclosure requests...</td>
								</tr>
							{:else if wallet.status !== 'connected'}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">
										<div class="flex flex-col items-center gap-3">
											<p>Connect your wallet to view your disclosure requests.</p>
											<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-2 rounded text-xs hover:bg-[#4edea3] transition-colors">
												Connect Wallet
											</a>
										</div>
									</td>
								</tr>
							{:else if visibleDisclosureRequests.length === 0}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">{emptyMessage}</td>
								</tr>
							{:else}
								{#each visibleDisclosureRequests as req}
									<tr class="hover:bg-[#1e1f26] transition-colors">
										<td class="px-6 py-4 font-mono text-xs text-zinc-300">{shortId(req.id)}</td>
										<td class="px-6 py-4 text-sm text-zinc-200">{req.dao?.name || 'Unknown DAO'}</td>
										<td class="px-6 py-4 font-mono text-xs text-zinc-400">{formatLabel(req.requestedScope)}</td>
										<td class="px-6 py-4 text-sm text-zinc-400">{formatLabel(req.reason)}</td>
										<td class="px-6 py-4 text-xs text-zinc-500">{formatDate(req.createdAt)}</td>
										<td class="px-6 py-4 text-center">
											<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border {getStatusColor(req.status)}">{formatLabel(req.status)}</span>
										</td>
										<td class="px-6 py-4 text-right">
											{#if req.status === 'pending'}
												<span class="text-xs text-zinc-500">Waiting for approval</span>
											{:else if req.status === 'fulfilled' && req.fulfilledReportId}
												<a href={`/auditor/reports/${req.fulfilledReportId}`} class="text-xs text-[#10b981] hover:underline font-bold">View Report</a>
											{:else if req.status === 'approved'}
												<span class="text-xs text-yellow-500">Report generating...</span>
											{:else if req.status === 'rejected'}
												<span class="text-xs text-red-500">Request denied</span>
											{:else}
												<span class="text-xs text-zinc-500">—</span>
											{/if}
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	</div>
</div>
