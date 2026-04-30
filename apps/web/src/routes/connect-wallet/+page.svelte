<svelte:head>
	<title>Connect Wallet – Umbra Treasury</title>
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
			{#each [
				{ name: 'MetaMask', icon: 'account_balance_wallet', desc: 'Browser extension wallet' },
				{ name: 'WalletConnect', icon: 'qr_code_2', desc: 'Scan with mobile wallet' },
				{ name: 'Coinbase Wallet', icon: 'currency_bitcoin', desc: 'Self-custody wallet' },
			] as wallet}
				<button class="w-full bg-[#18181b] border border-[#27272a] hover:border-[#10b981] hover:bg-[#1e1f26] transition-all duration-300 rounded-xl p-5 flex items-center gap-5 group active:scale-[0.98]">
					<div class="w-12 h-12 rounded-lg bg-[#27272a] group-hover:bg-[#10b981]/10 flex items-center justify-center flex-shrink-0 transition-colors">
						<span class="material-symbols-outlined text-[#10b981] text-2xl">{wallet.icon}</span>
					</div>
					<div class="text-left flex-1">
						<div class="font-data-point text-data-point text-white text-base">{wallet.name}</div>
						<div class="font-body-md text-body-md text-zinc-500 group-hover:text-zinc-400 mt-1 transition-colors">{wallet.desc}</div>
					</div>
					<span class="material-symbols-outlined text-zinc-700 group-hover:text-[#10b981] transition-all translate-x-0 group-hover:translate-x-1">chevron_right</span>
				</button>
			{/each}
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
			Secure • Transparent • Immutable
		</p>
	</div>
</main>
