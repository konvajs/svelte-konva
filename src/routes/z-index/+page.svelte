<script lang="ts">
	import ResponsiveStage from '../ResponsiveStage.svelte';

	// svelte-konva components
	import Circle from '$lib/Circle.svelte';
	import Layer from '$lib/Layer.svelte';

	let layerConfig = {};

	let configs = [
		{
			x: 420,
			y: 200,
			radius: 180,
			fill: 'red'
		},
		{
			x: 580,
			y: 200,
			radius: 180,
			fill: 'blue'
		},
		{
			x: 500,
			y: 280,
			radius: 180,
			fill: 'green'
		}
	];

	function shuffle() {
		configs.push(configs.shift()!);

		configs = configs;
	}
</script>

<h3>Change z-index of elements</h3>

<ResponsiveStage>
	<Layer bind:config={layerConfig}>
		{#each configs as config}
			<Circle bind:config />
		{/each}
	</Layer>
</ResponsiveStage>

<button on:click={shuffle} style="margin-top: 10px">Shuffle!</button>

<p style="margin-top: 10px">
	To change the component order it is recommended to rearrange the components using svelte instead
	of using the konva z-index method
</p>
