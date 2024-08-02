<script lang="ts">
	import Image from 'svelte-konva/Image.svelte';
	import Layer from 'svelte-konva/Layer.svelte';
	import Stage from 'svelte-konva/Stage.svelte';
	import type Konva from 'konva';
	import { onMount, type Snippet } from 'svelte';
	import { gameScale } from './store';

	// Assets
	import grid from './assets/grid.svg';
	import { GAME_BASE_SIZE } from './constants';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	let container: HTMLDivElement;

	let stageConfig: Konva.ContainerConfig = $state({
		width: GAME_BASE_SIZE,
		height: GAME_BASE_SIZE,
		scaleX: $gameScale,
		scaleY: $gameScale
	});

	let gameGrid = $state<HTMLImageElement>();
	let gridImageAvailable = $state(false);

	/**
	 * Resize the game grid scale and size if the container element changes in size
	 */
	function adjustScaleAndSize() {
		if (!container) {
			return;
		}

		let size = Math.min(container.offsetHeight, container.offsetWidth);

		stageConfig.width = size;
		stageConfig.height = size;
		gameScale.set(size / GAME_BASE_SIZE);
		stageConfig.scaleX = $gameScale;
		stageConfig.scaleY = $gameScale;
	}

	onMount(() => {
		gameGrid = document.createElement('img');
		gameGrid.src = grid;

		gameGrid.onload = () => {
			gridImageAvailable = true;
		};

		window.addEventListener('resize', () => adjustScaleAndSize());

		adjustScaleAndSize();
	});
</script>

<div
	class="flex items-center justify-center"
	bind:this={container}
	style="max-height: 80vh; height: 100%;"
>
	<Stage {...stageConfig}>
		<!--This layer is used to display the interactive/reactive game elements (tokens/stones)-->
		<Layer>
			{@render children()}
		</Layer>

		<!--This Layer is used to display the game grid. It is not interactive in any way-->
		<Layer listening={false}>
			{#if gridImageAvailable}
				<Image image={gameGrid} />
			{/if}
		</Layer>
	</Stage>
</div>
