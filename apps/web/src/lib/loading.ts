import { writable } from 'svelte/store';

export const isLoading = writable(false);

export async function processRequest<T>(fn: () => Promise<T>): Promise<T> {
	isLoading.set(true);
	try {
		const result = await fn();
		return result;
	} finally {
		// Minimum delay for visible transition
		await new Promise(resolve => setTimeout(resolve, 800));
		isLoading.set(false);
	}
}
