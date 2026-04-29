<script lang="ts">
	import '../index.css';
	import { isLoading } from '$lib/loading';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	
	let { children } = $props();

	// Show loading if either manual isLoading is true or SvelteKit is navigating
	let showLoading = $derived($isLoading || !!$navigating);
</script>

<svelte:head>
	<title>Umbra Treasury</title>
</svelte:head>

<div class="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-purple-500/30 relative overflow-x-hidden">
	<ToastContainer />

	{#if showLoading}
		<div 
			class="fixed top-0 left-0 w-full h-1 z-[100] bg-zinc-900 overflow-hidden"
			transition:fade={{ duration: 200 }}
		>
			<div class="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 w-1/3 animate-loading-slide shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
		</div>
	{/if}

	<div class="transition-all duration-500 {showLoading ? 'opacity-50 grayscale-[0.5] scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'}">
		{@render children?.()}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background-color: #050505;
	}

	@keyframes -global-loading-slide {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(300%); }
	}

	.animate-loading-slide {
		animation: -global-loading-slide 1.5s infinite linear;
	}
</style>
