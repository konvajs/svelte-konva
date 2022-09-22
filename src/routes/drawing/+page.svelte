<script lang="ts">
	import type Konva from 'konva';
	import ResponsiveStage from '../ResponsiveStage.svelte';
	import type { KonvaEventObject } from 'konva/lib/Node';
	import { getRealPointerPos } from '../util';

	// svelte-konva components
	import Layer from '$lib/Layer.svelte';
	import Line from '$lib/Line.svelte';

	let stage: Konva.Stage;
	let layer: Konva.Layer;

	const DRAW_TIMEOUT_MS = 5;

	enum Tools {
		Pen,
		Eraser
	}

	let strokes: Array<Konva.LineConfig> = []; // This array stores all pen and eraser strokes that have been made
	let selectedTool = Tools.Pen;
	let strokeWidth = 10;
	let isDrawing = false; // Flag is active if the user is currently drawing/erasing
	let drawTimeout: NodeJS.Timeout | null; // Timeout used to limit the pointermove event to not save too many data for the stroke points
	let drawTimeoutRunning = false; // Used to indicate wether the timeout is currently in progress or not

	function startDraw() {
		const pointerPos = getRealPointerPos(stage.getPointerPosition()!, stage);

		const lineConfig = {
			points: [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y], // Initial position is added twice to make a single click visible as dot (otherwise a single click would result in an invisible dot)
			stroke: 'yellow',
			strokeWidth,
			lineCap: 'round',
			lineJoin: 'round',
			tension: 0.5,
			draggable: false,
			globalCompositeOperation: ''
		};

		switch (selectedTool) {
			case Tools.Pen:
				lineConfig.globalCompositeOperation = 'source-over';
				break;
			case Tools.Eraser:
				lineConfig.globalCompositeOperation = 'destination-out';
				break;
		}

		strokes.push(lineConfig);

		strokes = strokes;
		isDrawing = true;
	}

	function draw() {
		if (!isDrawing) {
			return;
		}

		if (drawTimeout) {
			if (drawTimeoutRunning) {
				return;
			}

			const pointerPos = getRealPointerPos(stage.getPointerPosition()!, stage);

			const points = strokes[strokes.length - 1].points!;

			(points as Array<number>).push(pointerPos.x);
			(points as Array<number>).push(pointerPos.y);

			strokes = strokes;
		}

		drawTimeoutRunning = true;
		drawTimeout = setTimeout(() => {
			drawTimeoutRunning = false;
		}, DRAW_TIMEOUT_MS);
	}

	function stopDraw() {
		if (!isDrawing) {
			return;
		}

		isDrawing = false;
		drawTimeout = null;
		drawTimeoutRunning = false;
	}

	function drawMouseOut(e: CustomEvent<KonvaEventObject<PointerEvent>>) {
		const konvaEvent = e.detail;

		// Check if event target is stage (eg. user clicked on empty part of the stage and not any shape)
		if (konvaEvent.target.getType() !== 'Stage') {
			return;
		}

		stopDraw();
	}
</script>

<h3>Free drawing</h3>

<div class="palette">
	<button
		class={selectedTool === Tools.Pen ? 'palette-button palette-button-active' : 'palette-button'}
		on:click={() => (selectedTool = Tools.Pen)}>Pen</button
	>
	<button
		class={selectedTool === Tools.Eraser
			? 'palette-button palette-button-active'
			: 'palette-button'}
		on:click={() => (selectedTool = Tools.Eraser)}>Eraser</button
	>
	<input type="range" min="1" max="100" bind:value={strokeWidth} />
</div>

<ResponsiveStage
	on:pointerdown={startDraw}
	on:pointermove={draw}
	on:pointerup={stopDraw}
	on:mouseout={drawMouseOut}
	bind:handle={stage}
>
	<Layer config={{}} bind:handle={layer}>
		{#each strokes as stroke}
			<Line config={stroke} />
		{/each}
	</Layer>
</ResponsiveStage>

<p style="margin-top: 10px">Use the pen and eraser to draw on the stage</p>

<style>
	.palette {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.palette-button {
		margin: 5px;
	}

	.palette-button-active {
		background-color: yellow;
	}
</style>
