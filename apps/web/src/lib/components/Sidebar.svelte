<script lang="ts">
	import { page } from '$app/stores';

	const navItems = [
		{ href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
		{ href: '/transactions/add', icon: 'receipt_long', label: 'Transactions' },
		{ href: '/disclosures', icon: 'visibility', label: 'Disclosure Requests' },
		{ href: '/reports/public', icon: 'assessment', label: 'Reports' },
	];
</script>

<nav class="hidden md:flex h-screen w-64 border-r border-[#27272a] fixed left-0 top-0 bg-[#09090b] shadow-none flex-col gap-1 py-6 z-50">
	<div class="px-6 mb-8">
		<h1 class="font-h3 text-h3 text-zinc-50 font-bold tracking-tighter">Umbra Treasury</h1>
		<p class="font-label-mono text-label-mono text-zinc-400 mt-1">Institutional DAO</p>
	</div>
	<div class="flex-1 overflow-y-auto flex flex-col gap-1">
		{#each navItems as item}
			{@const isActive = $page.url.pathname.startsWith(item.href)}
			<a
				href={item.href}
				class="flex items-center gap-3 px-4 py-2 transition-colors duration-150 cursor-pointer active:opacity-80
				{isActive
					? 'text-emerald-400 bg-[#18181b] border-r-2 border-emerald-500'
					: 'text-zinc-400 hover:bg-[#18181b] hover:text-zinc-50'}"
			>
				<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' {isActive ? '1' : '0'};">
					{item.icon}
				</span>
				<span class="font-body-md text-body-md tracking-tight">{item.label}</span>
			</a>
		{/each}
	</div>
</nav>
