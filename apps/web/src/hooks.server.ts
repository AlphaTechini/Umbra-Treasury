import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// In development, ensure CSP allows localhost API connections
	if (process.env.NODE_ENV === 'development') {
		const csp = [
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline'",
			"style-src 'self' 'unsafe-inline' https:",
			"style-src-elem 'self' 'unsafe-inline' https:",
			"connect-src 'self' http://localhost:3007 https://api.mainnet-beta.solana.com https://api.devnet.solana.com wss://api.mainnet-beta.solana.com wss://api.devnet.solana.com https://utxo-indexer.api.umbraprivacy.com https://utxo-indexer.api-devnet.umbraprivacy.com https://relayer.api.umbraprivacy.com https://relayer.api-devnet.umbraprivacy.com",
			"img-src 'self' data: https:",
			"font-src 'self' data: https:",
			"object-src 'none'",
			"base-uri 'self'",
			"form-action 'self'",
			"frame-ancestors 'none'"
		].join('; ');

		response.headers.set('Content-Security-Policy', csp);
	}

	return response;
};
