import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import path from 'path';

const config: UserConfig = {
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['highlight.js', 'highlight.js/lib/core']
	},
	test: {
		include: ['src/tests/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		threads: false, // Workaround as testing with threads causes segfaults (likely vitest bug) Caution: ith this in place tests are not running in isolated threads!
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				resources: 'usable'
			}
		}
	},
	// Workaround as in svelte tests onMount is not called due to being in nodejs environment (SSR) see: https://github.com/testing-library/svelte-testing-library/issues/222#issuecomment-1588987135
	// By directly importing the runtime we force Svelte to call it without onMount being replaced by noop
	resolve: process.env.TEST
		? {
				alias: [
					{
						find: /^svelte$/,
						replacement: path.join(__dirname, 'node_modules/svelte/src/runtime/index.js')
					}
				]
		  }
		: {}
};

export default config;
