import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import { getDaoBySlug } from '$lib/api/daos';
import { ApiClientError } from '$lib/api/http';
import type { Dao } from '$lib/api/types';

const daoSessionStorageKey = 'umbra-treasury:dao-session:v1';

export const demoDaoSlug = 'umbra-demo';

export type DaoSessionState = {
	dao: Dao | null;
	slug: string | null;
	status: 'idle' | 'loading' | 'ready' | 'missing' | 'error';
	error: string | null;
	lastLoadedAt: string | null;
};

const initialDaoSession: DaoSessionState = {
	dao: null,
	slug: null,
	status: 'idle',
	error: null,
	lastLoadedAt: null
};

function createDaoSessionStore() {
	const { subscribe, set, update } = writable<DaoSessionState>(loadPersistedDaoSession());

	function persist(nextState: DaoSessionState) {
		if (!browser) {
			return;
		}

		if (!nextState.dao) {
			window.localStorage.removeItem(daoSessionStorageKey);
			return;
		}

		window.localStorage.setItem(
			daoSessionStorageKey,
			JSON.stringify({
				dao: nextState.dao,
				slug: nextState.slug,
				lastLoadedAt: nextState.lastLoadedAt
			})
		);
	}

	function setAndPersist(nextState: DaoSessionState) {
		set(nextState);
		persist(nextState);
	}

	async function loadDaoBySlug(slug: string, fetcher?: typeof fetch) {
		const normalizedSlug = slug.trim();

		update((currentState) => ({
			...currentState,
			slug: normalizedSlug,
			status: 'loading',
			error: null
		}));

		try {
			const { dao } = await getDaoBySlug(normalizedSlug, fetcher);
			const nextState: DaoSessionState = {
				dao,
				slug: dao.slug,
				status: 'ready',
				error: null,
				lastLoadedAt: new Date().toISOString()
			};
			setAndPersist(nextState);
			return dao;
		} catch (error) {
			const status = error instanceof ApiClientError && error.status === 404 ? 'missing' : 'error';
			const nextState: DaoSessionState = {
				dao: null,
				slug: normalizedSlug,
				status,
				error: getSessionErrorMessage(error),
				lastLoadedAt: null
			};
			setAndPersist(nextState);
			return null;
		}
	}

	return {
		subscribe,
		loadDaoBySlug,
		loadDemoDao(fetcher?: typeof fetch) {
			return loadDaoBySlug(demoDaoSlug, fetcher);
		},
		setActiveDao(dao: Dao) {
			setAndPersist({
				dao,
				slug: dao.slug,
				status: 'ready',
				error: null,
				lastLoadedAt: new Date().toISOString()
			});
		},
		clearActiveDao() {
			setAndPersist(initialDaoSession);
		},
		restore() {
			set(loadPersistedDaoSession());
		}
	};
}

function loadPersistedDaoSession(): DaoSessionState {
	if (!browser) {
		return initialDaoSession;
	}

	const storedValue = window.localStorage.getItem(daoSessionStorageKey);

	if (!storedValue) {
		return initialDaoSession;
	}

	try {
		const parsed = JSON.parse(storedValue) as {
			dao?: Dao;
			slug?: string | null;
			lastLoadedAt?: string | null;
		};

		if (!parsed.dao?.id || !parsed.dao.slug) {
			return initialDaoSession;
		}

		return {
			dao: parsed.dao,
			slug: parsed.slug ?? parsed.dao.slug,
			status: 'ready',
			error: null,
			lastLoadedAt: parsed.lastLoadedAt ?? null
		};
	} catch {
		window.localStorage.removeItem(daoSessionStorageKey);
		return initialDaoSession;
	}
}

function getSessionErrorMessage(error: unknown) {
	if (error instanceof Error) {
		return error.message;
	}

	return 'Unable to load DAO session';
}

export const daoSession = createDaoSessionStore();
export const activeDao = derived(daoSession, ($daoSession) => $daoSession.dao);
export const activeDaoId = derived(activeDao, ($activeDao) => $activeDao?.id ?? null);
