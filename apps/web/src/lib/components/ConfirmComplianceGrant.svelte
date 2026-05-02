<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		receiverAddress: string;
		scope: string;
		onConfirm: () => void;
		onCancel: () => void;
		children?: Snippet;
	};

	let { receiverAddress, scope, onConfirm, onCancel, children }: Props = $props();

	let understood = $state(false);
	let confirmText = $state('');

	const isConfirmEnabled = $derived(understood && confirmText.toLowerCase() === 'grant access');

	function handleConfirm() {
		if (isConfirmEnabled) {
			onConfirm();
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
	<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
		<h2 class="mb-4 text-xl font-bold text-gray-900">Confirm Compliance Grant</h2>

		<div class="mb-6 space-y-4">
			<div class="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
				<p class="text-sm font-medium text-yellow-800 mb-2">⚠️ Warning: This action grants access to private financial data</p>
				<p class="text-sm text-yellow-700">
					Once granted, the receiver will be able to decrypt and view the specified treasury information.
					This action cannot be easily undone.
				</p>
			</div>

			<div class="space-y-2">
				<div>
					<p class="text-sm font-medium text-gray-700">Receiver Address:</p>
					<p class="text-sm font-mono text-gray-900 break-all bg-gray-50 p-2 rounded">{receiverAddress}</p>
				</div>

				<div>
					<p class="text-sm font-medium text-gray-700">Scope of Access:</p>
					<p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{scope}</p>
				</div>
			</div>

			{#if children}
				<div class="text-sm text-gray-600">
					{@render children()}
				</div>
			{/if}

			<label class="flex items-start gap-2 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={understood}
					class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<span class="text-sm text-gray-700">
					I understand that this grants the receiver access to decrypt private treasury data within the specified scope.
				</span>
			</label>

			<div>
				<label for="confirm-text" class="block text-sm font-medium text-gray-700 mb-1">
					Type "grant access" to confirm:
				</label>
				<input
					id="confirm-text"
					type="text"
					bind:value={confirmText}
					placeholder="grant access"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					disabled={!understood}
				/>
			</div>
		</div>

		<div class="flex gap-3">
			<button
				type="button"
				onclick={onCancel}
				class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Cancel
			</button>
			<button
				type="button"
				onclick={handleConfirm}
				disabled={!isConfirmEnabled}
				class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
			>
				Confirm Grant
			</button>
		</div>
	</div>
</div>
