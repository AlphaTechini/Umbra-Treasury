<script lang="ts">
	import { ArrowRight, Shield, Zap, BarChart3, Globe, Sparkles } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted}
<main class="relative overflow-hidden min-h-screen flex flex-col items-center justify-center px-6 bg-[#050505]">
	<!-- Background grid/glow effect -->
	<div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]"></div>
		<div class="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"></div>
		<!-- Grid Pattern -->
		<div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
		<div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
	</div>

	<div class="z-10 text-center max-w-4xl" in:fade={{ duration: 1000 }}>
		<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-300 mb-8 backdrop-blur-md" in:fly={{ y: 20, delay: 200 }}>
			<div class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
			<span>v2.0 Evolution is live</span>
		</div>
		
		<h1 class="text-6xl md:text-9xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-[0.9]" in:fly={{ y: 20, delay: 400 }}>
			Umbra <br/> Treasury
		</h1>
		
		<p class="text-lg md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium" in:fly={{ y: 20, delay: 600 }}>
			Institutional liquidity at the speed of thought. 
			Secure, high-fidelity treasury operations for the digital-first economy.
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4" in:fly={{ y: 20, delay: 800 }}>
			<a href="/dashboard" class="group relative px-10 py-5 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
				<div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
				<span class="relative z-10 flex items-center gap-3 text-lg">
					Enter Terminal <ArrowRight size={20} />
				</span>
			</a>
			<button class="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 font-bold rounded-2xl transition-all text-lg backdrop-blur-md">
				Documentation
			</button>
		</div>
	</div>

	<!-- Stats / Features Footer -->
	<div class="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-24 z-10" in:fade={{ delay: 1200 }}>
		<div class="flex flex-col items-center gap-3 text-zinc-500 group cursor-default">
			<Shield size={28} class="group-hover:text-white transition-colors" />
			<div class="flex flex-col items-center">
				<span class="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 mb-1">Encrypted</span>
				<span class="text-xs font-bold text-zinc-400">Military Grade</span>
			</div>
		</div>
		<div class="flex flex-col items-center gap-3 text-zinc-500 group cursor-default">
			<Globe size={28} class="group-hover:text-white transition-colors" />
			<div class="flex flex-col items-center">
				<span class="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 mb-1">Global</span>
				<span class="text-xs font-bold text-zinc-400">Zero Latency</span>
			</div>
		</div>
		<div class="flex flex-col items-center gap-3 text-zinc-500 group cursor-default">
			<BarChart3 size={28} class="group-hover:text-white transition-colors" />
			<div class="flex flex-col items-center">
				<span class="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 mb-1">Real-time</span>
				<span class="text-xs font-bold text-zinc-400">T+0 Settlement</span>
			</div>
		</div>
		<div class="flex flex-col items-center gap-3 text-zinc-500 group cursor-default">
			<Sparkles size={28} class="group-hover:text-white transition-colors" />
			<div class="flex flex-col items-center">
				<span class="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-600 mb-1">AI Driven</span>
				<span class="text-xs font-bold text-zinc-400">Smart Insights</span>
			</div>
		</div>
	</div>

	<!-- Bottom Decor -->
	<div class="absolute bottom-10 left-10 flex flex-col gap-1 text-[8px] font-mono text-zinc-700 tracking-widest uppercase" in:fade={{ delay: 1500 }}>
		<span>System Status: Optimal</span>
		<span>Uplink Active: 0x291A...F01B</span>
	</div>
</main>
{/if}
