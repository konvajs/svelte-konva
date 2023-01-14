<script lang="ts">
	import { HighlightSvelte } from 'svelte-highlight';
	import solarizedDark from 'svelte-highlight/styles/solarized-dark';

	export let code: string;
	export let title: string;

	let show = false;
</script>

<svelte:head>
	{@html solarizedDark}
</svelte:head>

<div
	class={show
		? 'collapse collapse-open collapse-arrow border border-base-300 bg-base-100 rounded-box'
		: 'collapse collapse-close collapse-arrow border border-base-300 bg-base-100 rounded-box'}
>
	<button class="collapse-title text-xl font-medium" on:click={() => (show = !show)}>
		{title}
	</button>
	<div class="collapse-content not-prose">
		<HighlightSvelte {code} />
	</div>
</div>
