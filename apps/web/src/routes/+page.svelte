<svelte:head>
	<title>Umbra Treasury - Selective Transparency</title>
	<meta name="description" content="DAO transactions are private but can be revealed when needed. Built for institutional capital requiring rigorous operational security and verifiable compliance on public ledgers." />
</svelte:head>

<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800">
	<div class="flex justify-between items-center h-14 px-6 max-w-full">
		<div class="text-lg font-bold tracking-tighter text-zinc-50">Umbra Treasury</div>
		<div class="hidden md:flex items-center gap-8">
			<a class="font-sans text-sm tracking-tight font-medium text-emerald-500 font-semibold border-b border-emerald-500 pb-[17px] pt-[18px]" href="#">Protocol</a>
			<a class="font-sans text-sm tracking-tight font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150 px-2 py-1 rounded" href="#">Governance</a>
			<a class="font-sans text-sm tracking-tight font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150 px-2 py-1 rounded" href="#">Privacy</a>
			<a class="font-sans text-sm tracking-tight font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150 px-2 py-1 rounded" href="#">Analytics</a>
		</div>
		<div class="flex items-center gap-4">
			<div class="hidden sm:flex items-center gap-1">
				<button class="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150 p-1.5 rounded flex items-center justify-center">
					<span class="material-symbols-outlined text-[20px]">account_balance_wallet</span>
				</button>
				<button class="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors duration-150 p-1.5 rounded flex items-center justify-center">
					<span class="material-symbols-outlined text-[20px]">terminal</span>
				</button>
			</div>
			<a href="/connect-wallet" class="font-sans text-sm tracking-tight font-medium text-emerald-500 border border-zinc-800 px-4 py-1.5 rounded hover:bg-zinc-900 transition-colors duration-150">
				Connect Wallet
			</a>
		</div>
	</div>
</nav>

<main class="flex-grow pt-[56px]">
	<!-- Hero Section -->
	<section class="relative min-h-[819px] flex flex-col items-center justify-center border-b border-[#3c4a42] overflow-hidden px-6 py-12">
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1)_0%,_transparent_60%)] pointer-events-none"></div>
		<div class="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
			<h1 class="font-h1 text-h1 text-[#e3e1ec] mb-4 tracking-tighter">
				Private Treasury.<br/>
				<span class="text-[#10b981]">Selective Transparency.</span>
			</h1>
			<p class="font-body-lg text-body-lg text-[#bbcabf] max-w-2xl mb-12">
				DAO transactions are private but can be revealed when needed. Built for institutional capital requiring rigorous operational security and verifiable compliance on public ledgers.
			</p>
			<div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
				<a href="/dashboard" class="w-full sm:w-auto bg-[#10b981] text-[#003824] font-data-point text-data-point px-6 py-2 rounded hover:bg-[#4edea3] transition-colors border border-[#10b981]">
					Create Private Treasury
				</a>
				<a href="/public-treasury" class="w-full sm:w-auto bg-transparent text-[#e3e1ec] font-data-point text-data-point px-6 py-2 rounded border border-[#3c4a42] hover:border-[#4edea3] transition-colors">
					View Public Treasury
				</a>
			</div>
		</div>
	</section>

	<!-- Problem / Solution Bento Grid -->
	<section class="border-b border-[#3c4a42]">
		<div class="max-w-[1280px] mx-auto px-6 py-12">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
				<!-- Problem Card -->
				<div class="lg:col-span-6 bg-[#1a1b22] border border-[#3c4a42] p-6 flex flex-col min-h-[320px]">
					<div class="flex items-center gap-2 mb-6">
						<span class="material-symbols-outlined text-[#ffb4ab] text-[20px]">visibility</span>
						<span class="font-label-mono text-label-mono text-[#ffb4ab] uppercase">The Vulnerability</span>
					</div>
					<h2 class="font-h2 text-h2 text-[#e3e1ec] mb-4">Public blockchains expose everything.</h2>
					<div class="mt-auto pt-6 border-t border-[#3c4a42]">
						<p class="font-body-md text-body-md text-[#bbcabf]">
							Standard operational structures leave strategic capital vulnerable. Broadcasting every transaction payload, recipient address, and treasury balance to a public ledger compromises institutional security and negotiation leverage.
						</p>
					</div>
				</div>
				<!-- Solution Card -->
				<div class="lg:col-span-6 bg-[#1a1b22] border border-[#10b981] p-6 flex flex-col min-h-[320px] relative overflow-hidden">
					<div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#10b981]/20 to-transparent"></div>
					<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/20 to-transparent"></div>
					<div class="flex items-center gap-2 mb-6 relative z-10">
						<span class="material-symbols-outlined text-[#10b981] text-[20px]">vpn_key</span>
						<span class="font-label-mono text-label-mono text-[#10b981] uppercase">The Protocol</span>
					</div>
					<h2 class="font-h2 text-h2 text-[#e3e1ec] mb-4 relative z-10">Private by default, reveal when needed.</h2>
					<div class="mt-auto pt-6 border-t border-[#3c4a42] relative z-10">
						<p class="font-body-md text-body-md text-[#bbcabf]">
							Execute transactions within a shielded pool. Maintain complete operational privacy while retaining the cryptographic capability to generate granular viewing keys for auditors, compliance entities, or community stakeholders.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works Flow -->
	<section class="border-b border-[#3c4a42] bg-[#0d0e15]">
		<div class="max-w-[1280px] mx-auto px-6 py-12">
			<div class="mb-12 flex flex-col gap-2 border-l-2 border-[#10b981] pl-4">
				<h2 class="font-h2 text-h2 text-[#e3e1ec]">Execution Flow</h2>
				<p class="font-body-md text-body-md text-[#bbcabf]">Cryptographic process for selective disclosure.</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#3c4a42]">
				<div class="p-6 border-b md:border-b-0 md:border-r border-[#3c4a42] flex flex-col">
					<div class="flex items-center justify-between mb-6">
						<span class="font-label-mono text-label-mono text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded">01</span>
						<span class="material-symbols-outlined text-[#bbcabf]">lock</span>
					</div>
					<h3 class="font-h3 text-h3 text-[#e3e1ec] mb-2">Private transactions</h3>
					<p class="font-body-md text-body-md text-[#bbcabf]">Funds are moved within the shielded protocol. Sender, receiver, and amount remain cryptographically hidden from public network scanners.</p>
				</div>
				<div class="p-6 border-b md:border-b-0 md:border-r border-[#3c4a42] flex flex-col">
					<div class="flex items-center justify-between mb-6">
						<span class="font-label-mono text-label-mono text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded">02</span>
						<span class="material-symbols-outlined text-[#bbcabf]">assignment_returned</span>
					</div>
					<h3 class="font-h3 text-h3 text-[#e3e1ec] mb-2">Request disclosure</h3>
					<p class="font-body-md text-body-md text-[#bbcabf]">Authorized auditors, DAO governance proposals, or regulatory bodies submit on-chain requests for specific transaction blocks or operational timeframes.</p>
				</div>
				<div class="p-6 flex flex-col">
					<div class="flex items-center justify-between mb-6">
						<span class="font-label-mono text-label-mono text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded">03</span>
						<span class="material-symbols-outlined text-[#bbcabf]">key</span>
					</div>
					<h3 class="font-h3 text-h3 text-[#e3e1ec] mb-2">Reveal with viewing key</h3>
					<p class="font-body-md text-body-md text-[#bbcabf]">Treasury operators sign a message to generate a zero-knowledge viewing key, selectively decrypting only the requested data vectors.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Grid -->
	<section class="max-w-[1280px] mx-auto px-6 py-12">
		<div class="mb-4">
			<span class="font-label-mono text-label-mono text-[#bbcabf] uppercase tracking-widest">Protocol Capabilities</span>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<div class="border border-[#3c4a42] bg-[#12131a] p-4 flex items-start gap-4 hover:border-[#4edea3] transition-colors">
				<div class="mt-1">
					<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">payments</span>
				</div>
				<div>
					<h3 class="font-data-point text-data-point text-[#e3e1ec] mb-1">Private payments</h3>
					<p class="font-body-md text-body-md text-[#bbcabf] leading-snug">Disburse grants, payroll, or vendor settlements securely.</p>
				</div>
			</div>
			<div class="border border-[#3c4a42] bg-[#12131a] p-4 flex items-start gap-4 hover:border-[#4edea3] transition-colors">
				<div class="mt-1">
					<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">summarize</span>
				</div>
				<div>
					<h3 class="font-data-point text-data-point text-[#e3e1ec] mb-1">Public summaries</h3>
					<p class="font-body-md text-body-md text-[#bbcabf] leading-snug">Publish aggregated financial health metrics without raw data exposure.</p>
				</div>
			</div>
			<div class="border border-[#3c4a42] bg-[#12131a] p-4 flex items-start gap-4 hover:border-[#4edea3] transition-colors">
				<div class="mt-1">
					<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">policy</span>
				</div>
				<div>
					<h3 class="font-data-point text-data-point text-[#e3e1ec] mb-1">Auditor reports</h3>
					<p class="font-body-md text-body-md text-[#bbcabf] leading-snug">Generate cryptographically verified compliance documentation on demand.</p>
				</div>
			</div>
		</div>
	</section>
</main>

<!-- Footer -->
<footer class="w-full py-12 bg-zinc-950 border-t border-zinc-800">
	<div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
		<div class="text-zinc-400 font-semibold font-sans text-xs uppercase tracking-widest">Umbra Treasury</div>
		<div class="flex flex-wrap justify-center gap-x-8 gap-y-4">
			<a class="font-sans text-xs uppercase tracking-widest text-zinc-500 hover:text-emerald-500 transition-colors opacity-80 hover:opacity-100" href="#">Github</a>
			<a class="font-sans text-xs uppercase tracking-widest text-zinc-500 hover:text-emerald-500 transition-colors opacity-80 hover:opacity-100" href="#">Documentation</a>
			<a class="font-sans text-xs uppercase tracking-widest text-zinc-500 hover:text-emerald-500 transition-colors opacity-80 hover:opacity-100" href="#">Audits</a>
			<a class="font-sans text-xs uppercase tracking-widest text-zinc-500 hover:text-emerald-500 transition-colors opacity-80 hover:opacity-100" href="#">Discord</a>
		</div>
		<div class="font-sans text-xs uppercase tracking-widest text-zinc-500 text-center md:text-right">
			© 2024 Umbra Treasury. Institutional Privacy.
		</div>
	</div>
</footer>
