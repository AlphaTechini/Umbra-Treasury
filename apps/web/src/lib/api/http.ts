import { getApiBaseUrl } from './config';

export class ApiClientError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly payload: unknown
	) {
		super(message);
		this.name = 'ApiClientError';
	}
}

type RequestBody = Record<string, unknown> | unknown[] | string | number | boolean | null;

type ApiRequestOptions = {
	body?: RequestBody | undefined;
	fetcher?: typeof fetch | undefined;
	headers?: HeadersInit | undefined;
};

export function apiGet<T>(path: string, options: Omit<ApiRequestOptions, 'body'> = {}) {
	return apiRequest<T>('GET', path, options);
}

export function apiPost<T>(path: string, body: RequestBody, options: Omit<ApiRequestOptions, 'body'> = {}) {
	return apiRequest<T>('POST', path, { ...options, body });
}

export function apiPatch<T>(path: string, body: RequestBody, options: Omit<ApiRequestOptions, 'body'> = {}) {
	return apiRequest<T>('PATCH', path, { ...options, body });
}

async function apiRequest<T>(method: string, path: string, options: ApiRequestOptions): Promise<T> {
	const fetcher = options.fetcher ?? fetch;
	const response = await fetcher(`${getApiBaseUrl()}${path}`, {
		method,
		headers: {
			Accept: 'application/json',
			...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
			...options.headers
		},
		...(options.body === undefined ? {} : { body: JSON.stringify(options.body) })
	});
	const payload = await parseResponse(response);

	if (!response.ok) {
		throw new ApiClientError(getErrorMessage(payload, response.status), response.status, payload);
	}

	return payload as T;
}

async function parseResponse(response: Response): Promise<unknown> {
	if (response.status === 204) {
		return null;
	}

	const text = await response.text();

	if (!text) {
		return null;
	}

	try {
		return JSON.parse(text);
	} catch {
		return text;
	}
}

function getErrorMessage(payload: unknown, status: number) {
	if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
		return payload.error;
	}

	return `API request failed with status ${status}`;
}
