<script lang="ts">
	import Warn from '../../Warn.svelte';
</script>

<h2>Usage with SvelteKit</h2>

<p>
	As of now (recent SevelteKit releases), you do not need to do any special preparation to use
	svelte-konva in SvelteKit applications. Simply use the library as you normally would and make sure
	to not call any svelte-konva or Konva related functinalities in a server context as both libraries
	only work in the browser.
</p>

<Warn>
	<p>
		SvelteKit is evolving rapidly and has not yet reached a full stable release. Things might change
		and lead to issues with svelte-konva. If you encounter an issue please file one in the <a
			href="https://github.com/TeyKey1/svelte-konva/issues"
			target="_blank">svelte-konva repository</a
		>.
	</p>
</Warn>
