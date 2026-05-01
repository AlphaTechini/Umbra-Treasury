import { apiGet } from './http';
import type { AccessLog } from './types';

export function getDaoAccessLogs(daoId: string, fetcher?: typeof fetch) {
	return apiGet<{ accessLogs: AccessLog[] }>(`/daos/${encodeURIComponent(daoId)}/access-logs`, { fetcher });
}
