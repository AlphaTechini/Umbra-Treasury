<script lang="ts">
	import { daoSession, walletSession } from '$lib/session';
	import { toasts } from '$lib/toasts';
	import { LogOut } from 'lucide-svelte';

	function handleDisconnect() {
		walletSession.disconnect();
		daoSession.clearActiveDao();
		toasts.add('Wallet disconnected', 'info');
	}

	function shortAddress(address: string) {
		if (address.length <= 12) return address;
		return `${address.slice(0, 4)}...${address.slice(-4)}`;
	}
</script>

{#if $walletSession.status === 'connected' && $walletSession.walletAddress}
	<div class="flex items-center gap-3 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-1.5">
		<span class="text-xs font-mono text-zinc-400">{shortAddress($walletSession.walletAddress)}</span>
		<button
			type="button"
			onclick={handleDisconnect}
			class="text-zinc-500 hover:text-red-400 transition-colors"
			title="Disconnect wallet"
		>
			<LogOut size={14} />
		</button>
	</div>
{:else}
	<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
		Connect Wallet
	</a>
{/if}
