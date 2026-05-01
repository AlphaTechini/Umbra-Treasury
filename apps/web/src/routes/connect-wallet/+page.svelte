<script lang="ts">
	import { goto } from '$app/navigation';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';
	import { connectWalletAndLoadDao } from '$lib/session';
	import { toasts } from '$lib/toasts';
	import { watchCompatibleWallets, type CompatibleWallet } from '$lib/umbra';
	import { onMount } from 'svelte';

	let wallets = $state<CompatibleWallet[]>([]);
	let isDiscoveringWallets = $state(true);

	function getWalletConnectAction(walletName: string) {
		return `wallet:connect:${walletName}`;
	}

	async function handleWalletConnect(walletName: string) {
		await runRequestAction(getWalletConnectAction(walletName), async () => {
			toasts.add(`Connecting ${walletName}...`, 'info');
			const result = await connectWalletAndLoadDao(walletName);
			const registrationCount = result.umbraRegistrationSignatures.length;

			toasts.add(
				`Connected ${result.walletName}, registered Umbra user${registrationCount ? ` (${registrationCount} tx)` : ''}, and loaded ${result.daoSlug}.`,
				'success'
			);
			await goto('/dashboard');
		});
	}

	onMount(() => {
		const stopWatchingWallets = watchCompatibleWallets((nextWallets) => {
			wallets = nextWallets;
			isDiscoveringWallets = false;
		});

		return stopWatchingWallets;
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
				<span class="material-symbols-outlined text-[#10b981] text-4xl" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
			</div>
			<h1 class="font-h2 text-h2 text-white mb-3 tracking-tight">Connect Wallet</h1>
			<p class="font-body-md text-body-md text-zinc-400 max-w-[320px] mx-auto">Access your private treasury with a secure Web3 wallet connection.</p>
		</div>

		<!-- Wallet Options -->
		<div class="space-y-4 mb-10">
			{#if isDiscoveringWallets}
				<div class="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-5 text-center text-sm text-zinc-400">
					Searching for compatible Solana wallets...
				</div>
			{:else if wallets.length === 0}
				<div class="w-full bg-[#18181b] border border-[#27272a] rounded-xl p-5 text-center">
					<div class="font-data-point text-data-point text-white text-base">No compatible wallet found</div>
					<p class="font-body-md text-body-md text-zinc-500 mt-2">Install a Wallet Standard Solana wallet, then reopen this page.</p>
				</div>
			{:else}
				{#each wallets as wallet}
				{@const walletAction = getWalletConnectAction(wallet.name)}
				<button
					onclick={() => handleWalletConnect(wallet.name)}
					disabled={$pendingRequestActions[walletAction]}
					class="w-full bg-[#18181b] border border-[#27272a] hover:border-[#10b981] hover:bg-[#1e1f26] transition-all duration-300 rounded-xl p-5 flex items-center gap-5 group active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
				>
					<div class="w-12 h-12 rounded-lg bg-[#27272a] group-hover:bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 transition-colors">
						<img src={wallet.icon} alt="" class="h-7 w-7 rounded-sm" />
					</div>
					<div class="text-left flex-1">
						<div class="font-data-point text-data-point text-white text-base">{wallet.name}</div>
						<div class="font-body-md text-body-md text-zinc-500 group-hover:text-zinc-400 mt-1 transition-colors">
							{$pendingRequestActions[walletAction] ? 'Connecting...' : 'Wallet Standard Solana adapter'}
						</div>
					</div>
					<span class="material-symbols-outlined text-zinc-700 group-hover:text-[#10b981] transition-all translate-x-0 group-hover:translate-x-1">chevron_right</span>
				</button>
				{/each}
			{/if}
		</div>

		<!-- Privacy Notice -->
		<div class="bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl p-5 mb-8">
			<div class="flex items-start gap-4">
				<div class="mt-1">
					<span class="material-symbols-outlined text-[#10b981] text-xl" style="font-variation-settings: 'FILL' 1;">shield</span>
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
				<span class="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
				Back to home
			</a>
		</div>

		<p class="text-center font-label-mono text-label-mono text-zinc-700 mt-12 uppercase tracking-[0.2em] text-[10px]">
			Secure - Transparent - Immutable
		</p>
	</div>
</main>
