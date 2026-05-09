import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'@': './src',
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline', 'https:'],
				'style-src-elem': ['self', 'unsafe-inline', 'https:'],
				'connect-src': [
					'self',
					'http://localhost:3007',
					'https://api.mainnet-beta.solana.com',
					'https://api.devnet.solana.com',
					'wss://api.mainnet-beta.solana.com',
					'wss://api.devnet.solana.com',
					'https://utxo-indexer.api.umbraprivacy.com',
					'https://utxo-indexer.api-devnet.umbraprivacy.com',
					'https://relayer.api.umbraprivacy.com',
					'https://relayer.api-devnet.umbraprivacy.com'
				],
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self', 'data:', 'https:'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['none'],
				'upgrade-insecure-requests': true
			}
		}
	}
};

export default config;
