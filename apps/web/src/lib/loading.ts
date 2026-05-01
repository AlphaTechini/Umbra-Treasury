import { writable } from 'svelte/store';

export const isLoading = writable(false);
export const pendingRequestActions = writable<Record<string, boolean>>({});

let activeRequestCount = 0;
const activeActionKeys = new Set<string>();

export async function processRequest<T>(fn: () => Promise<T>): Promise<T> {
	activeRequestCount += 1;
	isLoading.set(true);
	try {
		const result = await fn();
		return result;
	} finally {
		// Minimum delay for visible transition
		await new Promise(resolve => setTimeout(resolve, 800));
		activeRequestCount = Math.max(0, activeRequestCount - 1);
		isLoading.set(activeRequestCount > 0);
	}
}

export async function runRequestAction<T>(actionKey: string, fn: () => Promise<T>): Promise<T | undefined> {
	if (activeActionKeys.has(actionKey)) {
		return undefined;
	}

	activeActionKeys.add(actionKey);
	setActionPending(actionKey, true);

	try {
		return await processRequest(fn);
	} finally {
		activeActionKeys.delete(actionKey);
		setActionPending(actionKey, false);
	}
}

function setActionPending(actionKey: string, isPending: boolean) {
	pendingRequestActions.update((actions) => {
		if (isPending) {
			return { ...actions, [actionKey]: true };
		}

		const { [actionKey]: _finishedAction, ...remainingActions } = actions;
		return remainingActions;
	});
}
