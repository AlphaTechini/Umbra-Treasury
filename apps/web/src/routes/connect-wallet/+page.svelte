<svelte:head>
	<title>Connect Wallet – Umbra Treasury</title>
	<meta name="description" content="Connect your wallet to access the Umbra Treasury private transaction protocol." />
</svelte:head>

<main class="min-h-screen flex items-center justify-center bg-[#09090b] px-4 py-8">
	<div class="w-full max-w-md">
		<!-- Logo / Identity -->
		<div class="text-center mb-10">
			<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 mb-6">
				<span class="material-symbols-outlined text-[#10b981] text-3xl" style="font-variation-settings: 'FILL' 1;">account_balance_wallet</span>
			</div>
			<h1 class="font-h2 text-h2 text-white mb-2">Connect Wallet</h1>
			<p class="font-body-md text-body-md text-zinc-400">Access your private treasury with a Web3 wallet.</p>
		</div>

		<!-- Wallet Options -->
		<div class="space-y-3 mb-8">
			{#each [
				{ name: 'MetaMask', icon: 'account_balance_wallet', desc: 'Browser extension wallet' },
				{ name: 'WalletConnect', icon: 'qr_code_2', desc: 'Scan with mobile wallet' },
				{ name: 'Coinbase Wallet', icon: 'currency_bitcoin', desc: 'Self-custody wallet' },
			] as wallet}
				<button class="w-full bg-[#18181b] border border-[#27272a] hover:border-[#10b981] hover:bg-[#1e1f26] transition-all duration-200 rounded-lg p-4 flex items-center gap-4 active:scale-[0.99]">
					<div class="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center flex-shrink-0">
						<span class="material-symbols-outlined text-[#10b981] text-xl">{wallet.icon}</span>
					</div>
					<div class="text-left flex-1">
						<div class="font-data-point text-data-point text-white">{wallet.name}</div>
						<div class="font-body-md text-body-md text-zinc-400 mt-0.5">{wallet.desc}</div>
					</div>
					<span class="material-symbols-outlined text-zinc-600 text-lg">chevron_right</span>
				</button>
			{/each}
		</div>

		<!-- Privacy Notice -->
		<div class="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4 mb-6">
			<div class="flex items-start gap-3">
				<span class="material-symbols-outlined text-[#10b981] text-lg mt-0.5" style="font-variation-settings: 'FILL' 1;">shield</span>
				<div>
					<p class="font-data-point text-data-point text-[#10b981] mb-1">Privacy Protected</p>
					<p class="font-body-md text-body-md text-zinc-400">Your wallet address and transaction data are encrypted. Only you control what is visible to others.</p>
				</div>
			</div>
		</div>

		<!-- Footer Actions -->
		<div class="flex items-center justify-between">
			<a href="/" class="font-body-md text-body-md text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
				<span class="material-symbols-outlined text-sm">arrow_back</span>
				Back
			</a>
			<a href="#" class="font-body-md text-body-md text-emerald-500 hover:text-emerald-400 transition-colors">
				Need help?
			</a>
		</div>

		<p class="text-center font-label-mono text-label-mono text-zinc-600 mt-8 uppercase tracking-widest">
			Secure. Transparent. Immutable.
		</p>
	</div>
</main>
