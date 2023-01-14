<h2>Usage with SvelteKit</h2>

<p>
	svelte-konva works with SvelteKit v1 out of the box. You do not need to do any special preparation
	to use svelte-konva in SvelteKit applications. Simply use the library as you normally would and
	make sure to not call any svelte-konva or Konva related functinalities in a server context as both
	libraries only work in the browser.
</p>

<p>
	You can use svelte-konva in ssr components as well as prerendered components without having to
	worry about unintended execution on the server-side as svelte-konva only runs client-side code
	inside the <code>onMount</code> and <code>onDestroy</code> hooks.
</p>
