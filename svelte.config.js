import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	vitePlugin: {
		dynamicCompileOptions({ filename }) {
			if (filename.includes('node_modules')) return { runes: false }; // Do not opt-in for runes only mode on deps
		}
	},

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			precompress: false
		}),
		alias: {
			'svelte-konva': 'src/lib'
		}
	},

	compilerOptions: {
		runes: true,
		warningFilter: (warning) => warning.code !== 'state_referenced_locally' // We filter this one out for the moment as it is annoying and affects a lot of intentional use-cases within the code base
	}
};

export default config;
