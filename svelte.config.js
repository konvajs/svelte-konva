import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

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
		runes: true
	}
};

export default config;
