<script lang="ts">
	import type Konva from 'konva';
	import Stage from '$lib/Stage.svelte';
	import { onMount } from 'svelte';

	export let handle: null | Konva.Stage = null;

	let container: HTMLDivElement;

	const STAGE_BASE_WIDTH = 1000; // Base width of the stage used to calculate the required scale at any container width to make sure that the examples are all appropriately scaled on each window size

	let config = {
		width: STAGE_BASE_WIDTH,
		height: 1000,
		scaleX: 1,
		scaleY: 1
	};

	function updateStageSize() {
		if (container) {
			// Subtract 10 px because of 5px border of div container
			config.width = container.offsetWidth - 10;
			config.height = container.offsetHeight - 10;
			let scale = config.width / STAGE_BASE_WIDTH;
			config.scaleX = scale;
			config.scaleY = scale;
		}
	}

	onMount(() => {
		window.addEventListener('resize', updateStageSize);

		updateStageSize();
	});
</script>

<div bind:this={container} style="border: solid grey 5px;">
	<Stage
		{config}
		bind:handle
		on:pointerdblclick
		on:pointerdown
		on:pointerup
		on:pointermove
		on:mouseout
	>
		<slot />
	</Stage>
</div>
