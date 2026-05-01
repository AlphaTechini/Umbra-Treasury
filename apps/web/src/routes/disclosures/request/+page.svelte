<script lang="ts">
	import { goto } from '$app/navigation';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';

	const submitDisclosureRequestAction = 'disclosures:request:create';

	async function handleSubmitDisclosureRequest(event: SubmitEvent) {
		event.preventDefault();
		await runRequestAction(submitDisclosureRequestAction, async () => {
			await goto('/disclosures');
		});
	}
</script>

<svelte:head>
	<title>Request Transaction Disclosure – Umbra Treasury</title>
</svelte:head>

<main class="min-h-screen bg-[#09090b] flex flex-col font-body-md text-white items-center justify-center p-6">
	<div class="w-full max-w-[560px]">
		<!-- Context & Identity -->
		<div class="mb-8 text-center flex flex-col items-center">
			<div class="h-12 w-12 rounded-full border border-[#27272a] bg-[#18181b] flex items-center justify-center mb-4">
				<span class="material-symbols-outlined text-[#10b981]" style="font-variation-settings: 'FILL' 1;">description</span>
			</div>
			<h1 class="font-h2 text-h2 text-white mb-2">Request Transaction Disclosure</h1>
			<p class="font-body-md text-body-md text-[#10b981] bg-[#10b981]/10 px-4 py-2 border border-[#10b981]/20 rounded inline-flex items-center gap-2">
				<span class="material-symbols-outlined text-[16px]">info</span>
				DAO owner must approve request before access is granted.
			</p>
		</div>

		<!-- Form Card -->
		<form
			class="bg-[#18181b] border border-[#27272a] rounded-xl p-6 flex flex-col gap-6"
			onsubmit={handleSubmitDisclosureRequest}
		>
			<!-- Input: Name -->
			<div class="flex flex-col gap-2">
				<label class="font-label-mono text-label-mono text-zinc-400" for="name">Name</label>
				<input
					id="name"
					name="name"
					type="text"
					placeholder="John Doe"
					class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] placeholder:text-zinc-600 transition-colors"
				/>
			</div>

			<!-- Input: Organization -->
			<div class="flex flex-col gap-2">
				<label class="font-label-mono text-label-mono text-zinc-400" for="organization">Organization</label>
				<input
					id="organization"
					name="organization"
					type="text"
					placeholder="Acme Corp"
					class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] placeholder:text-zinc-600 transition-colors"
				/>
			</div>

			<!-- Input: Reason -->
			<div class="flex flex-col gap-2">
				<label class="font-label-mono text-label-mono text-zinc-400" for="reason">Reason</label>
				<div class="relative">
					<select
						id="reason"
						name="reason"
						class="appearance-none w-full bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] transition-colors cursor-pointer"
					>
						<option value="" disabled selected hidden>Select reason...</option>
						<option value="audit">Audit</option>
						<option value="tax">Tax</option>
						<option value="review">Review</option>
						<option value="other">Other</option>
					</select>
					<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">expand_more</span>
				</div>
			</div>

			<!-- Input: Scope -->
			<div class="flex flex-col gap-2">
				<label class="font-label-mono text-label-mono text-zinc-400 mb-1">Scope</label>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
					{#each [
						{ value: 'single', label: 'Single Tx' },
						{ value: 'category', label: 'Category', checked: true },
						{ value: 'daterange', label: 'Date Range' },
					] as scope}
						<label class="cursor-pointer relative">
							<input type="radio" name="scope" value={scope.value} class="peer sr-only" checked={scope.checked} />
							<div class="bg-[#09090b] border border-[#27272a] rounded px-4 py-2.5 text-center transition-all font-body-md text-body-md text-zinc-400 peer-checked:border-[#10b981] peer-checked:text-[#10b981] peer-checked:bg-[#10b981]/5 hover:border-zinc-500">
								{scope.label}
							</div>
						</label>
					{/each}
				</div>
			</div>

			<!-- Input: Message -->
			<div class="flex flex-col gap-2">
				<label class="font-label-mono text-label-mono text-zinc-400" for="message">Message</label>
				<textarea
					id="message"
					name="message"
					placeholder="Briefly explain the purpose of your request..."
					rows="4"
					class="bg-[#09090b] border border-[#27272a] rounded font-body-md text-body-md text-white px-4 py-3 focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] placeholder:text-zinc-600 transition-colors resize-none"
				></textarea>
			</div>

			<hr class="border-[#27272a] my-1"/>

			<!-- Actions -->
			<div class="flex items-center gap-4">
				<button
					type="button"
					onclick={() => goto('/reports/public')}
					class="px-4 py-3 border border-[#27272a] rounded font-data-point text-data-point text-white hover:bg-[#27272a] transition-colors w-1/3"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={$pendingRequestActions[submitDisclosureRequestAction]}
					class="px-4 py-3 bg-[#10b981] rounded font-data-point text-data-point text-[#002113] hover:bg-[#4edea3] transition-all w-2/3 flex justify-center items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<span>{$pendingRequestActions[submitDisclosureRequestAction] ? 'Submitting...' : 'Submit Request'}</span>
					<span class="material-symbols-outlined text-[18px]">send</span>
				</button>
			</div>
		</form>

		<div class="mt-6 text-center font-label-mono text-label-mono text-zinc-500">
			Secure. Transparent. Immutable.
		</div>
	</div>
</main>
