<script lang="ts">
	import { getDaoAccessLogs } from '$lib/api/accessLogs';
	import type { AccessLog } from '$lib/api/types';
	import { formatDateTime, formatLabel, shortId } from '$lib/display';
	import { onMount } from 'svelte';

	type Props = {
		daoId: string | null | undefined;
	};

	let { daoId }: Props = $props();
	let accessLogs = $state<AccessLog[]>([]);
	let isLoading = $state(true);
	let statusMessage = $state('Loading access activity...');

	onMount(() => {
		void loadAccessLogs();
	});

	async function loadAccessLogs() {
		if (!daoId) {
			statusMessage = 'Connect a wallet or load a DAO to view activity.';
			isLoading = false;
			return;
		}

		isLoading = true;
		statusMessage = 'Loading access activity...';

		try {
			const response = await getDaoAccessLogs(daoId);
			accessLogs = response.accessLogs;
			statusMessage = 'No access activity has been recorded yet.';
		} catch (error) {
			statusMessage = error instanceof Error ? error.message : 'Unable to load access activity.';
		} finally {
			isLoading = false;
		}
	}

	function getActorLabel(log: AccessLog) {
		return log.actor?.username ?? log.actorLabel ?? shortId(log.actor?.walletAddress);
	}

	function getSafeMetadata(log: AccessLog) {
		const metadata = log.metadata ?? {};
		const rows: string[] = [];

		if (typeof metadata.source === 'string') {
			rows.push(`Source: ${formatLabel(metadata.source)}`);
		}

		if (typeof metadata.verificationStatus === 'string') {
			rows.push(`Verification: ${formatLabel(metadata.verificationStatus)}`);
		}

		if (typeof metadata.umbraOperationType === 'string') {
			rows.push(`Umbra operation: ${formatLabel(metadata.umbraOperationType)}`);
		}

		if (typeof metadata.category === 'string') {
			rows.push(`Category: ${formatLabel(metadata.category)}`);
		}

		if (typeof metadata.type === 'string') {
			rows.push(`Type: ${formatLabel(metadata.type)}`);
		}

		if (typeof metadata.disclosureRequestId === 'string') {
			rows.push(`Request: ${shortId(metadata.disclosureRequestId)}`);
		}

		if (typeof metadata.providerReference === 'string') {
			rows.push(`Reference: ${shortId(metadata.providerReference)}`);
		}

		if (metadata.grantTransactionSignature || metadata.grantAccountAddress) {
			rows.push('Grant reference recorded');
		}

		return rows;
	}
</script>

<section class="bg-[#18181b] border border-[#27272a] rounded-lg overflow-hidden">
	<div class="px-6 py-4 border-b border-[#27272a] flex items-center justify-between gap-4">
		<div>
			<h2 class="font-h3 text-h3 text-white">Access Activity</h2>
			<p class="text-sm text-zinc-400 mt-1">Public-safe audit trail for disclosure and report actions.</p>
		</div>
		<button
			type="button"
			onclick={loadAccessLogs}
			disabled={isLoading}
			class="px-3 py-2 text-xs font-bold rounded border border-[#3f3f46] text-zinc-200 hover:bg-[#27272a] disabled:cursor-not-allowed disabled:opacity-60"
		>
			{isLoading ? 'Refreshing...' : 'Refresh'}
		</button>
	</div>

	<div class="divide-y divide-[#27272a]">
		{#if isLoading}
			<div class="px-6 py-8 text-sm text-zinc-400">{statusMessage}</div>
		{:else if accessLogs.length === 0}
			<div class="px-6 py-8 text-sm text-zinc-400">{statusMessage}</div>
		{:else}
			{#each accessLogs as log}
				{@const safeRows = getSafeMetadata(log)}
				<div class="px-6 py-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
					<div class="min-w-0">
						<div class="flex flex-wrap items-center gap-2">
							<span class="text-sm font-bold text-white">{formatLabel(log.action)}</span>
							<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#10b981]/30 bg-[#10b981]/10 text-[#4edea3]">
								{formatLabel(log.targetType)}
							</span>
						</div>
						<p class="text-xs text-zinc-400 mt-1">
							{getActorLabel(log)} acted on {shortId(log.targetId)}
						</p>
						{#if safeRows.length > 0}
							<div class="mt-2 flex flex-wrap gap-2">
								{#each safeRows as row}
									<span class="text-[11px] text-zinc-300 bg-[#0d0e15] border border-[#27272a] rounded px-2 py-1">{row}</span>
								{/each}
							</div>
						{/if}
					</div>
					<time class="text-xs text-zinc-500 whitespace-nowrap" datetime={log.createdAt}>{formatDateTime(log.createdAt)}</time>
				</div>
			{/each}
		{/if}
	</div>
</section>
