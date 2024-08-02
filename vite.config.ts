import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	optimizeDeps: {
		include: ['highlight.js', 'highlight.js/lib/core']
	},
	test: {
		include: ['src/tests/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		pool: 'forks', // Workaround as testing with threads causes segfaults (likely vitest bug) Caution: with this in place tests are not running in isolated threads!
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				resources: 'usable'
			}
		}
	}
});
