<script lang="ts">
	import Stage from '../../ResponsiveStage.svelte';

	// svelte-konva components
	import Circle from 'svelte-konva/Circle.svelte';
	import Layer from 'svelte-konva/Layer.svelte';
	import Group from 'svelte-konva/Group.svelte';

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

<Stage>
	<Layer>
		<Group config={{ draggable: true }}>
			{#each configs as config}
				<Circle bind:config />
			{/each}
		</Group>
	</Layer>
</Stage>
