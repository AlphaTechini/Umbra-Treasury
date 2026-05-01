import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const walletSessionStorageKey = 'umbra-treasury:wallet-session:v1';

export type WalletSessionState = {
	walletAddress: string | null;
	status: 'disconnected' | 'connected';
	lastConnectedAt: string | null;
};

const initialWalletSession: WalletSessionState = {
	walletAddress: null,
	status: 'disconnected',
	lastConnectedAt: null
};

function createWalletSessionStore() {
	const { subscribe, set } = writable<WalletSessionState>(loadPersistedWalletSession());

	function persist(nextState: WalletSessionState) {
		if (!browser) {
			return;
		}

		if (!nextState.walletAddress) {
			window.localStorage.removeItem(walletSessionStorageKey);
			return;
		}

		window.localStorage.setItem(walletSessionStorageKey, JSON.stringify(nextState));
	}

	function setAndPersist(nextState: WalletSessionState) {
		set(nextState);
		persist(nextState);
	}

	return {
		subscribe,
		connect(walletAddress: string) {
			setAndPersist({
				walletAddress,
				status: 'connected',
				lastConnectedAt: new Date().toISOString()
			});
		},
		disconnect() {
			setAndPersist(initialWalletSession);
		},
		restore() {
			set(loadPersistedWalletSession());
		}
	};
}

function loadPersistedWalletSession(): WalletSessionState {
	if (!browser) {
		return initialWalletSession;
	}

	const storedValue = window.localStorage.getItem(walletSessionStorageKey);

	if (!storedValue) {
		return initialWalletSession;
	}

	try {
		const parsed = JSON.parse(storedValue) as Partial<WalletSessionState>;

		if (!parsed.walletAddress || parsed.status !== 'connected') {
			return initialWalletSession;
		}

		return {
			walletAddress: parsed.walletAddress,
			status: 'connected',
			lastConnectedAt: parsed.lastConnectedAt ?? null
		};
	} catch {
		window.localStorage.removeItem(walletSessionStorageKey);
		return initialWalletSession;
	}
}

export const walletSession = createWalletSessionStore();
