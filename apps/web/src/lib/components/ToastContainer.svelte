<script lang="ts">
	import { toasts } from '$lib/toasts';
	import { fade, fly } from 'svelte/transition';
	import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-svelte';

	const icons = {
		info: Info,
		success: CheckCircle,
		warning: AlertTriangle,
		error: AlertCircle
	};

	const colors = {
		info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
		success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
		warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
		error: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
	};
</script>

<div class="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
	{#each $toasts as toast (toast.id)}
		<div 
			class="flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl pointer-events-auto min-w-[280px] max-w-md {colors[toast.type]}"
			in:fly={{ x: 20, duration: 400 }}
			out:fade={{ duration: 200 }}
		>
			<svelte:component this={icons[toast.type]} size={18} />
			<p class="text-sm font-medium flex-1">{toast.message}</p>
			<button 
				onclick={() => toasts.remove(toast.id)}
				class="p-1 hover:bg-white/5 rounded-md transition-colors"
			>
				<X size={14} />
			</button>
		</div>
	{/each}
</div>
