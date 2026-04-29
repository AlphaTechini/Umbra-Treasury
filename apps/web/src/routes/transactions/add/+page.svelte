<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<svelte:head>
	<title>Add Private Transaction – Umbra Treasury</title>
	<meta name="description" content="Send a private transaction via the Umbra shielded protocol." />
</svelte:head>

<div class="flex h-screen overflow-hidden bg-[#09090b]">
	<Sidebar />

	<div class="flex-1 md:ml-64 flex flex-col min-h-screen">
		<!-- TopAppBar -->
		<header class="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
			<div class="flex items-center gap-4">
				<a href="/dashboard" class="text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b] transition-colors p-1.5 rounded-lg">
					<span class="material-symbols-outlined">arrow_back</span>
				</a>
				<h1 class="font-h3 text-h3 text-white">Send Private Transaction</h1>
			</div>
			<a href="/connect-wallet" class="bg-[#10b981] text-[#002113] font-bold px-4 py-1.5 rounded text-xs hover:bg-[#4edea3] transition-colors active:scale-[0.98]">
				Connect Wallet
			</a>
		</header>

		<main class="flex-1 overflow-y-auto p-6">
			<div class="max-w-2xl mx-auto">
				<!-- Privacy Badge -->
				<div class="bg-[#10b981]/5 border border-[#10b981]/20 rounded-lg p-4 mb-6 flex items-start gap-3">
					<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">shield</span>
					<div>
						<p class="font-data-point text-data-point text-[#10b981] mb-1">Shielded Protocol Active</p>
						<p class="font-body-md text-body-md text-zinc-400">This transaction will be private by default. Recipient, amount, and memo are encrypted on-chain.</p>
					</div>
				</div>

				<!-- Form Card -->
				<form class="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col gap-5">
					<!-- Recipient Address -->
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase" for="recipient">Recipient Address</label>
						<input
							id="recipient"
							type="text"
							placeholder="0x... or umbra.eth"
							class="bg-[#0d0e15] border border-[#27272a] focus:border-zinc-400 focus:ring-0 rounded-lg px-4 py-3 font-body-md text-body-md text-zinc-200 placeholder:text-zinc-600 transition-colors"
						/>
					</div>

					<!-- Amount + Token -->
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase" for="amount">Amount</label>
						<div class="flex gap-2">
							<input
								id="amount"
								type="text"
								placeholder="0.00"
								class="flex-1 bg-[#0d0e15] border border-[#27272a] focus:border-zinc-400 focus:ring-0 rounded-lg px-4 py-3 font-data-point text-data-point text-zinc-200 placeholder:text-zinc-600 transition-colors"
							/>
							<div class="relative w-36">
								<select class="appearance-none w-full bg-[#0d0e15] border border-[#27272a] focus:border-zinc-400 focus:ring-0 rounded-lg px-4 py-3 font-body-md text-body-md text-zinc-200 cursor-pointer transition-colors">
									<option value="eth">ETH</option>
									<option value="usdc">USDC</option>
									<option value="dai">DAI</option>
								</select>
								<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">expand_more</span>
							</div>
						</div>
					</div>

					<!-- Memo / Note -->
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase" for="memo">Memo (encrypted)</label>
						<input
							id="memo"
							type="text"
							placeholder="Purpose of this transaction..."
							class="bg-[#0d0e15] border border-[#27272a] focus:border-zinc-400 focus:ring-0 rounded-lg px-4 py-3 font-body-md text-body-md text-zinc-200 placeholder:text-zinc-600 transition-colors"
						/>
					</div>

					<!-- Category -->
					<div class="flex flex-col gap-2">
						<label class="font-label-mono text-label-mono text-zinc-400 uppercase" for="category">Category</label>
						<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
							{#each ['Payroll', 'Grants', 'Infrastructure', 'Operations'] as cat, i}
								<label class="cursor-pointer">
									<input type="radio" name="category" value={cat.toLowerCase()} class="peer sr-only" checked={i === 0} />
									<div class="border border-[#27272a] rounded-lg px-3 py-2 text-center font-body-md text-body-md text-zinc-400 peer-checked:border-[#10b981] peer-checked:text-[#10b981] peer-checked:bg-[#10b981]/5 hover:border-zinc-500 transition-all">
										{cat}
									</div>
								</label>
							{/each}
						</div>
					</div>

					<!-- Viewing Key Disclosure Option -->
					<div class="border-t border-[#27272a] pt-5 flex flex-col gap-3">
						<div class="flex items-center gap-3">
							<input type="checkbox" id="generate-key" class="w-4 h-4 accent-[#10b981]" />
							<label for="generate-key" class="font-body-md text-body-md text-zinc-300 cursor-pointer">Generate viewing key for this transaction</label>
						</div>
						<p class="font-body-md text-body-md text-zinc-500 text-xs ml-7">A one-time key that allows a specified party to decrypt this transaction only.</p>
					</div>

					<!-- Action Buttons -->
					<div class="flex gap-3 pt-2">
						<a href="/dashboard" class="px-6 py-3 border border-[#27272a] rounded-lg font-data-point text-data-point text-zinc-300 hover:bg-[#27272a] transition-colors">
							Cancel
						</a>
						<button type="submit" class="flex-1 bg-[#10b981] text-[#002113] font-bold py-3 rounded-lg text-sm tracking-wide hover:bg-[#4edea3] transition-colors active:scale-[0.99] flex items-center justify-center gap-2">
							<span class="material-symbols-outlined text-[18px]">lock</span>
							Send Private Transaction
						</button>
					</div>
				</form>

				<!-- Footer -->
				<p class="text-center font-label-mono text-label-mono text-zinc-600 mt-6 uppercase tracking-widest">
					Encrypted. Verifiable. Private.
				</p>
			</div>
		</main>
	</div>
</div>
