import { env } from '$env/dynamic/public';

const defaultApiBaseUrl = 'http://localhost:3007';

export function getApiBaseUrl() {
	const configuredUrl = env.PUBLIC_API_BASE_URL?.trim() || defaultApiBaseUrl;
	return configuredUrl.replace(/\/+$/, '');
}
