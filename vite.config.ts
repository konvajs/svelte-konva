import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
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
		},
		// TODO: Alias to enable Svelte 5 support on testing-library, can be removed once stable
		alias: {
			'@testing-library/svelte': '@testing-library/svelte/svelte5'
		}
	}
};

export default config;
