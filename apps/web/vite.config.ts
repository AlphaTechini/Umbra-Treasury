import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		envDir: '../..',
		plugins: [sveltekit(), tailwindcss()],
		define: {
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		},
		server: {
			hmr: process.env.DISABLE_HMR !== 'true',
			port: 5174,
			host: '0.0.0.0',
			strictPort: false,
			fs: {
				strict: false
			}
		},
		optimizeDeps: {
			include: [
				'lucide-svelte',
				'clsx',
				'tailwind-merge'
			],
			exclude: [
				'@umbra-privacy/sdk',
				'@umbra-privacy/web-zk-prover'
			]
		},
		ssr: {
			noExternal: ['lucide-svelte']
		},
		esbuild: {
			logOverride: { 'this-is-undefined-in-esm': 'silent' }
		}
	};
});
