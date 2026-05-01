<script lang="ts">
	import { getDaoDisclosureRequests } from '$lib/api/disclosures';
	import type { DisclosureRequest } from '$lib/api/types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { formatDate, formatLabel, shortId } from '$lib/display';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { daoSession } from '$lib/session';
	import { toasts } from '$lib/toasts';
	import { onMount } from 'svelte';

	let disclosureRequests = $state<DisclosureRequest[]>([]);
	let isLoadingData = $state(true);
	let emptyMessage = $state('Loading disclosure requests...');

	onMount(async () => {
		const dao = await daoSession.loadDemoDao();

		if (!dao) {
			emptyMessage = 'No data yet. Connect a wallet or create a DAO treasury to begin.';
			isLoadingData = false;
			return;
		}

		try {
			const response = await getDaoDisclosureRequests(dao.id);
			disclosureRequests = response.disclosureRequests;
			emptyMessage = 'No data yet.';
		} catch (error) {
			emptyMessage = error instanceof Error ? error.message : 'No data yet.';
		} finally {
			isLoadingData = false;
		}
	});

	function getDisclosureReviewAction(requestId: string, status: 'approved' | 'rejected') {
		return `disclosures:review:${requestId}:${status}`;
	}

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

	async function handleDisclosureReview(requestId: string, status: 'approved' | 'rejected') {
		await runRequestAction(getDisclosureReviewAction(requestId, status), async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toasts.add('Wallet authorization is needed before this backend action can be submitted.', 'warning');
		});
	}
</script>

<svelte:head>
	<title>Disclosure Requests - Umbra Treasury</title>
	<meta name="description" content="Manage transaction disclosure requests." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center flex-1"></div>
			<div class="flex items-center gap-3">
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
							{#if isLoadingData}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">Loading disclosure requests...</td>
								</tr>
							{:else if disclosureRequests.length === 0}
								<tr>
									<td class="px-6 py-8 text-center text-sm text-zinc-500" colspan="7">{emptyMessage}</td>
								</tr>
							{:else}
								{#each disclosureRequests as req}
									<tr class="hover:bg-[#1e1f26] transition-colors">
										<td class="px-6 py-4 font-mono text-xs text-zinc-300">{shortId(req.id)}</td>
										<td class="px-6 py-4 text-sm text-zinc-200">{req.requesterName}</td>
										<td class="px-6 py-4 font-mono text-xs text-zinc-400">{req.transactionId ? shortId(req.transactionId) : formatLabel(req.requestedScope)}</td>
										<td class="px-6 py-4 text-sm text-zinc-400">{formatLabel(req.reason)}</td>
										<td class="px-6 py-4 text-xs text-zinc-500">{formatDate(req.createdAt)}</td>
										<td class="px-6 py-4 text-center">
											<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border {getStatusColor(req.status)}">{formatLabel(req.status)}</span>
										</td>
										<td class="px-6 py-4 text-right">
											{#if req.status === 'pending'}
												{@const approveAction = getDisclosureReviewAction(req.id, 'approved')}
												{@const rejectAction = getDisclosureReviewAction(req.id, 'rejected')}
												<div class="flex items-center justify-end gap-2">
													<button
														onclick={() => handleDisclosureReview(req.id, 'approved')}
														disabled={$pendingRequestActions[approveAction] || $pendingRequestActions[rejectAction]}
														class="text-xs text-[#10b981] hover:underline font-bold disabled:cursor-not-allowed disabled:opacity-60"
													>
														{$pendingRequestActions[approveAction] ? 'Approving...' : 'Approve'}
													</button>
													<button
														onclick={() => handleDisclosureReview(req.id, 'rejected')}
														disabled={$pendingRequestActions[approveAction] || $pendingRequestActions[rejectAction]}
														class="text-xs text-red-500 hover:underline font-bold disabled:cursor-not-allowed disabled:opacity-60"
													>
														{$pendingRequestActions[rejectAction] ? 'Rejecting...' : 'Reject'}
													</button>
												</div>
											{:else}
												<button class="text-xs text-zinc-500 hover:text-zinc-300">View</button>
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
