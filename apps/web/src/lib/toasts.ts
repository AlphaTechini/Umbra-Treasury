import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

const { subscribe, update } = writable<Toast[]>([]);

export const toasts = {
	subscribe,
	add: (message: string, type: ToastType = 'info') => {
		const id = Math.random().toString(36).substring(2, 9);
		update(all => [{ id, message, type }, ...all]);
		setTimeout(() => {
			update(all => all.filter(t => t.id !== id));
		}, 5000);
	},
	remove: (id: string) => {
		update(all => all.filter(t => t.id !== id));
	}
};
