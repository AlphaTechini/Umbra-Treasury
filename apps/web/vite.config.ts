import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
	return {
		envDir: '../..',
		plugins: [sveltekit(), tailwindcss()],
		server: {
			hmr: process.env.DISABLE_HMR !== 'true',
			port: 5173,
			host: '0.0.0.0'
		}
	};
});
