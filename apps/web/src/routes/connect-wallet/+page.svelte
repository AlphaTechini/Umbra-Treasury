<script lang="ts">
	import { goto } from '$app/navigation';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { walletSession } from '$lib/session';
	import { toasts } from '$lib/toasts';
	import { detectInstalledWallets, connectDirectWallet, getWalletInstallUrl, type SolanaWallet } from '$lib/umbra/directWalletDetection';
	import { createUser } from '$lib/api/users';
	import { onMount } from 'svelte';
	import { Wallet, Shield, ArrowLeft, ChevronRight, ExternalLink, Ghost, Flame, Backpack, Sparkles, CircleDollarSign } from 'lucide-svelte';

	let wallets = $state<SolanaWallet[]>([]);

	function getWalletConnectAction(walletName: string) {
		return `wallet:connect:${walletName}`;
	}

	async function handleWalletConnect(wallet: SolanaWallet) {
		if (!wallet.isInstalled) {
			window.open(getWalletInstallUrl(wallet.name), '_blank');
			return;
		}

		await runRequestAction(getWalletConnectAction(wallet.name), async () => {
			toasts.add(`Connecting ${wallet.name}...`, 'info');
			try {
				const walletAddress = await connectDirectWallet(wallet.name);
				
				// Create user in database
				await createUser({ 
					walletAddress, 
					username: wallet.name 
				});
				
				// Persist wallet session
				walletSession.connect(walletAddress, wallet.name);
				
				toasts.add(`Connected! Address: ${walletAddress.slice(0, 8)}...`, 'success');
				await goto('/dashboard');
			} catch (error: any) {
				toasts.add(error.message || `Failed to connect ${wallet.name}`, 'error');
			}
		});
	}

	function getInstallUrl(walletName: string): string {
		return getWalletInstallUrl(walletName);
	}

	onMount(() => {
		wallets = detectInstalledWallets();
	});
</script>

<svelte:head>
	<title>Connect Wallet - Umbra Treasury</title>
	<meta name="description" content="Connect your wallet to access the Umbra Treasury private transaction protocol." />
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#09090b] px-6 py-12">
	<div class="w-full max-w-[480px] flex flex-col">
		<!-- Logo / Identity -->
		<div class="text-center mb-12">
			<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
				<Wallet class="text-[#10b981]" size={40} />
			</div>
			<h1 class="font-h2 text-h2 text-white mb-3 tracking-tight">Connect Wallet</h1>
			<p class="font-body-md text-body-md text-zinc-400 max-w-[320px] mx-auto">Access your private treasury with a secure Web3 wallet connection.</p>
		</div>

		<!-- Wallet Options -->
		<div class="space-y-4 mb-10">
			{#each wallets as wallet}
			{@const walletAction = getWalletConnectAction(wallet.name)}
			<button
				onclick={() => handleWalletConnect(wallet)}
				disabled={$pendingRequestActions[walletAction]}
				class="w-full bg-[#18181b] border border-[#27272a] hover:border-[#10b981] hover:bg-[#1e1f26] transition-all duration-300 rounded-xl p-5 flex items-center gap-5 group active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
			>
				<div class="w-12 h-12 rounded-lg bg-[#27272a] group-hover:bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 transition-colors">
					{#if wallet.icon === 'Ghost'}
						<Ghost class="text-[#10b981]" size={28} />
					{:else if wallet.icon === 'Flame'}
						<Flame class="text-[#10b981]" size={28} />
					{:else if wallet.icon === 'Backpack'}
						<Backpack class="text-[#10b981]" size={28} />
					{:else if wallet.icon === 'Sparkles'}
						<Sparkles class="text-[#10b981]" size={28} />
					{:else if wallet.icon === 'CircleDollarSign'}
						<CircleDollarSign class="text-[#10b981]" size={28} />
					{/if}
				</div>
				<div class="text-left flex-1">
					<div class="font-data-point text-data-point text-white text-base flex items-center gap-2">
						{wallet.name}
						{#if wallet.isInstalled}
							<span class="text-[10px] bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-full font-mono">INSTALLED</span>
						{:else}
							<span class="text-[10px] bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded-full font-mono">NOT INSTALLED</span>
						{/if}
					</div>
					<div class="font-body-md text-body-md text-zinc-500 group-hover:text-zinc-400 mt-1 transition-colors">
						{#if $pendingRequestActions[walletAction]}
							Connecting...
						{:else if wallet.isInstalled}
							Click to connect
						{:else}
							Click to install
						{/if}
					</div>
				</div>
			{#if wallet.isInstalled}
					<ChevronRight class="text-zinc-700 group-hover:text-[#10b981] transition-all translate-x-0 group-hover:translate-x-1" size={20} />
				{:else}
					<ExternalLink class="text-zinc-700 group-hover:text-zinc-500" size={18} />
				{/if}
			</button>
			{/each}
		</div>

		<!-- Privacy Notice -->
		<div class="bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl p-5 mb-8">
			<div class="flex items-start gap-4">
				<div class="mt-1">
					<Shield class="text-[#10b981]" size={20} fill="currentColor" />
				</div>
				<div>
					<p class="font-data-point text-data-point text-[#10b981] mb-1 uppercase tracking-wider text-xs">Privacy Protocol Active</p>
					<p class="font-body-md text-body-md text-zinc-400 leading-relaxed">Your wallet address and transaction data remain encrypted. Only you control the disclosure keys.</p>
				</div>
			</div>
		</div>

		<!-- Footer Actions -->
		<div class="flex items-center px-2">
			<a href="/" class="font-body-md text-body-md text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">
				<ArrowLeft class="transition-transform group-hover:-translate-x-1" size={18} />
				Back to home
			</a>
		</div>

		<p class="text-center font-label-mono text-label-mono text-zinc-700 mt-12 uppercase tracking-[0.2em] text-[10px]">
			Secure - Transparent - Immutable
		</p>
	</div>
</main>
