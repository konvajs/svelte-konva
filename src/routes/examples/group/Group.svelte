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
		<Group draggable>
			{#each configs as _, idx}
				<Circle {...configs[idx]} bind:x={configs[idx].x} bind:y={configs[idx].y} />
				<!-- TODO: Binding here seems like a bug. X and y coordinates never change if group is dragged. Make sure this is not a side effect of svelte 5 update -->
			{/each}
		</Group>
	</Layer>
</Stage>
