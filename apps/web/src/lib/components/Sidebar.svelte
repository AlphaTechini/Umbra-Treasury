<script lang="ts">
	import { 
		LayoutDashboard, 
		ArrowLeftRight, 
		FilePieChart, 
		Settings, 
		LogOut, 
		Bell, 
		Search,
		User
	} from 'lucide-svelte';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';

	const menuItems = [
		{ name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
		{ name: 'Transactions', icon: ArrowLeftRight, href: '/transactions' },
		{ name: 'Reports', icon: FilePieChart, href: '/reports' },
	];

	const bottomItems = [
		{ name: 'Settings', icon: Settings, href: '/settings' },
	];
</script>

<aside class="w-64 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 bg-[#050505] z-50">
	<div class="p-6">
		<a href="/" class="flex items-center gap-2 mb-10">
			<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
				U
			</div>
			<span class="font-bold tracking-tight text-xl">Umbra</span>
		</a>

		<nav class="space-y-1">
			{#each menuItems as item}
				{@const active = $page.url.pathname === item.href}
				<a 
					href={item.href}
					class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all group {active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
				>
					<item.icon 
						size={18} 
						class={active ? 'text-purple-400' : 'group-hover:text-white transition-colors'} 
					/>
					<span class="text-sm font-medium">{item.name}</span>
					{#if active}
						<div class="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
					{/if}
				</a>
			{/each}
		</nav>
	</div>

	<div class="mt-auto p-6 space-y-4">
		<nav class="space-y-1">
			{#each bottomItems as item}
				{@const active = $page.url.pathname === item.href}
				<a 
					href={item.href}
					class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all group {active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}"
				>
					<item.icon size={18} />
					<span class="text-sm font-medium">{item.name}</span>
				</a>
			{/each}
			<button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all mt-2">
				<LogOut size={18} />
				<span class="text-sm font-medium">Logout</span>
			</button>
		</nav>

		<div class="pt-6 border-t border-white/5">
			<div class="flex items-center gap-3 px-2">
				<div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
					<User size={16} class="text-zinc-400" />
				</div>
				<div class="flex flex-col">
					<span class="text-xs font-semibold text-white">Alex Rivera</span>
					<span class="text-[10px] text-zinc-500">Administrator</span>
				</div>
			</div>
		</div>
	</div>
</aside>
