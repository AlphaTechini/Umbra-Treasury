<script lang="ts">
	import { CheckCircle, Clock, ShieldCheck, TriangleAlert } from 'lucide-svelte';

	type UmbraStatus = 'idle' | 'pending' | 'ready' | 'error';

	type Props = {
		status: UmbraStatus;
		title: string;
		detail?: string;
		reference?: string;
	};

	let { status, title, detail, reference }: Props = $props();

	const iconByStatus = {
		idle: ShieldCheck,
		pending: Clock,
		ready: CheckCircle,
		error: TriangleAlert
	};

	const toneByStatus = {
		idle: 'border-zinc-700 bg-zinc-950 text-zinc-200',
		pending: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-100',
		ready: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100',
		error: 'border-rose-500/40 bg-rose-950/30 text-rose-100'
	};

	const Icon = $derived(iconByStatus[status]);
</script>

<div class="rounded-lg border p-4 {toneByStatus[status]}">
	<div class="flex items-start gap-3">
		<Icon size={20} class="mt-0.5 shrink-0" />
		<div class="min-w-0 space-y-1">
			<h3 class="text-sm font-semibold leading-5">{title}</h3>
			{#if detail}
				<p class="text-sm leading-5 opacity-80">{detail}</p>
			{/if}
			{#if reference}
				<p class="truncate text-xs leading-5 opacity-70">{reference}</p>
			{/if}
		</div>
	</div>
</div>
