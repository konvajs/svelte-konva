<script lang="ts">
	import ResponsiveStage from '../ResponsiveStage.svelte';

	// svelte-konva components
	import Circle from '$lib/Circle.svelte';
	import Layer from '$lib/Layer.svelte';
	import Group from '$lib/Group.svelte';

	let layerConfig = {};

	let configs = [
		{
			x: 200,
			y: 240,
			radius: 120,
			fill: 'red'
		},
		{
			x: 120,
			y: 80,
			radius: 120,
			fill: 'blue'
		},
		{
			x: 100,
			y: 400,
			radius: 120,
			fill: 'green'
		}
	];
</script>

<h3>Grouping</h3>

<ResponsiveStage>
	<Layer bind:config={layerConfig}>
		<Group config={{ draggable: true }}>
			{#each configs as config}
				<Circle bind:config />
			{/each}
		</Group>
	</Layer>
</ResponsiveStage>

<p style="margin-top: 10px">
	Drag one of the circles and observe that the other circles are moved as well because all circles
	are grouped together
</p>
