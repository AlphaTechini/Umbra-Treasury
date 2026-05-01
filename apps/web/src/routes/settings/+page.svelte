<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/toasts';
	import { pendingRequestActions, runRequestAction } from '$lib/loading';

	let mounted = $state(false);
	const saveSettingsAction = 'settings:save';
	const rotateKeysAction = 'settings:rotate-keys';

	onMount(() => {
		mounted = true;
	});

	async function handleSaveChanges() {
		await runRequestAction(saveSettingsAction, async () => {
			toasts.add('Verifying credentials...', 'info');
			await new Promise(r => setTimeout(r, 1200));
			toasts.add('System parameters updated successfully.', 'success');
		});
	}

	async function handleRotateKeys() {
		await runRequestAction(rotateKeysAction, async () => {
			await new Promise(r => setTimeout(r, 1000));
			toasts.add('Authentication keys rotated. Please re-authenticate your API clients.', 'warning');
		});
	}

	let tfaEnabled = $state(true);
</script>

{#if mounted}
<div class="flex">
	<Sidebar />
	<main class="flex-1 ml-64 p-8">
		<header class="mb-10" in:fade>
			<h1 class="text-3xl font-bold tracking-tight mb-1">System Settings</h1>
			<p class="text-zinc-500 text-sm">Configure terminal preferences and security parameters.</p>
		</header>

		<div class="max-w-2xl space-y-8" in:fly={{ y: 20, delay: 200 }}>
			<section class="glass-card p-6">
				<h3 class="font-bold mb-4">Profile Information</h3>
				<form class="space-y-4" onsubmit={(e) => e.preventDefault()}>
					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<label class="text-xs font-bold text-zinc-500 uppercase tracking-widest" for="first-name">First Name</label>
							<input type="text" id="first-name" value="Alex" class="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500/50" />
						</div>
						<div class="space-y-2">
							<label class="text-xs font-bold text-zinc-500 uppercase tracking-widest" for="last-name">Last Name</label>
							<input type="text" id="last-name" value="Rivera" class="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500/50" />
						</div>
					</div>
					<div class="space-y-2">
						<label class="text-xs font-bold text-zinc-500 uppercase tracking-widest" for="email">Email Address</label>
						<input type="email" id="email" value="alex@umbra.finance" class="w-full bg-white/5 border border-white/5 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500/50" />
					</div>
				</form>
			</section>

			<section class="glass-card p-6">
				<h3 class="font-bold mb-4">Security</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between p-3 rounded-lg bg-white/5">
						<div>
							<p class="text-sm font-semibold">Two-Factor Authentication</p>
							<p class="text-xs text-zinc-500">Secure your account with an extra layer of safety.</p>
						</div>
						<button 
							onclick={() => {
								tfaEnabled = !tfaEnabled;
								toasts.add(`2FA ${tfaEnabled ? 'enabled' : 'disabled'}.`, 'info');
							}}
							class="w-10 h-5 {tfaEnabled ? 'bg-purple-500' : 'bg-zinc-700'} rounded-full relative transition-colors"
							aria-label="Toggle 2FA"
						>
							<div class="absolute {tfaEnabled ? 'right-1' : 'left-1'} top-1 w-3 h-3 bg-white rounded-full transition-all"></div>
						</button>
					</div>
					<button 
						onclick={handleRotateKeys}
						disabled={$pendingRequestActions[rotateKeysAction]}
						class="w-full py-2 border border-purple-500/30 text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-500 hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
					>
						{$pendingRequestActions[rotateKeysAction] ? 'Rotating...' : 'Rotate API Keys'}
					</button>
				</div>
			</section>

			<div class="flex justify-end gap-3 pt-4">
				<button 
					onclick={() => toasts.add('Changes discarded.')}
					class="px-6 py-2 rounded-lg text-sm font-bold text-zinc-500 hover:text-white transition-colors"
				>
					Discard
				</button>
				<button 
					onclick={handleSaveChanges}
					disabled={$pendingRequestActions[saveSettingsAction]}
					class="px-6 py-2 rounded-lg text-sm font-bold bg-white text-black hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
				>
					{$pendingRequestActions[saveSettingsAction] ? 'Saving...' : 'Save Changes'}
				</button>
			</div>
		</div>
	</main>
</div>
{/if}
