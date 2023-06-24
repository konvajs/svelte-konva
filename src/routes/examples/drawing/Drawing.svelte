<script lang="ts">
	import type Konva from 'konva';
	import type { KonvaMouseEvent } from 'svelte-konva';
	import Stage from '../../ResponsiveStage.svelte';
	import { getRealPointerPos } from '../../util';

	// svelte-konva components
	import Layer from 'svelte-konva/Layer.svelte';
	import Line from 'svelte-konva/Line.svelte';
	import type { LineCap, LineJoin } from 'konva/lib/Shape';

	let stage: Konva.Stage;

	const DRAW_TIMEOUT_MS = 5;

	enum Tools {
		Pen,
		Eraser
	}

	let strokes: Array<Konva.LineConfig> = []; // This array stores all pen and eraser strokes that have been made
	let selectedTool = Tools.Pen;
	let strokeWidth = 10;
	let isDrawing = false; // Flag is active if the user is currently drawing/erasing
	let drawTimeout: NodeJS.Timeout | null; // Timeout used to limit the pointermove event to not save too much data for the stroke points
	let drawTimeoutRunning = false; // Used to indicate wether the timeout is currently in progress or not

	function startDraw() {
		const pointerPos = getRealPointerPos(stage.getPointerPosition()!, stage);

		const lineConfig = {
			points: [pointerPos.x, pointerPos.y, pointerPos.x, pointerPos.y], // Initial position is added twice to make a single click visible as dot (otherwise a single click would result in an invisible dot)
			stroke: 'yellow',
			strokeWidth,
			lineCap: 'round' as LineCap,
			lineJoin: 'round' as LineJoin,
			tension: 0.5,
			draggable: false,
			globalCompositeOperation: 'source-over' as GlobalCompositeOperation
		};

		if (selectedTool === Tools.Eraser) {
			lineConfig.globalCompositeOperation = 'destination-out';
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

	function drawMouseOut(e: KonvaMouseEvent) {
		const konvaEvent = e.detail;

		// Check if event target is stage (eg. user clicked on empty part of the stage and not any shape)
		if (konvaEvent.target.getType() !== 'Stage') {
			return;
		}

		stopDraw();
	}
</script>

<div class="flex align-middle justify-around m-2">
	<div class="btn-group">
		<button
			class={selectedTool === Tools.Pen ? 'btn btn-active' : 'btn'}
			on:click={() => (selectedTool = Tools.Pen)}>Pen</button
		>
		<button
			class={selectedTool === Tools.Eraser ? 'btn btn-active' : 'btn'}
			on:click={() => (selectedTool = Tools.Eraser)}>Eraser</button
		>
	</div>
	<div class="flex flex-col justify-around align-middle">
		<span>Size:</span>
		<input type="range" min="1" max="100" bind:value={strokeWidth} class="range range-sm" />
	</div>
</div>

<Stage
	on:pointerdown={startDraw}
	on:pointermove={draw}
	on:pointerup={stopDraw}
	on:mouseout={drawMouseOut}
	bind:handle={stage}
>
	<Layer>
		{#each strokes as stroke}
			<Line config={stroke} />
		{/each}
	</Layer>
</Stage>
