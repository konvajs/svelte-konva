<script lang="ts">
	import type Konva from 'konva';
	import type { KonvaMouseEvent } from 'svelte-konva';
	import ResponsiveStage from '../../ResponsiveStage.svelte';
	import { getRealPointerPos } from '../../util';
	import Stage from 'svelte-konva/Stage.svelte';
	import type { LineCap, LineJoin } from 'konva/lib/Shape';

	// svelte-konva components
	import Layer from 'svelte-konva/Layer.svelte';
	import Line from 'svelte-konva/Line.svelte';

	let stage: Stage | undefined = $state();

	const DRAW_TIMEOUT_MS = 5;

	enum Tools {
		Pen,
		Eraser
	}

	let strokes = $state<Array<Konva.LineConfig>>([]); // This array stores all pen and eraser strokes that have been made
	let selectedTool = $state(Tools.Pen);
	let strokeWidth = $state(10);
	let isDrawing = false; // Flag is active if the user is currently drawing/erasing
	let drawTimeout: NodeJS.Timeout | null; // Timeout used to limit the pointermove event to not save too much data for the stroke points
	let drawTimeoutRunning = false; // Used to indicate wether the timeout is currently in progress or not

	function startDraw() {
		if (!stage || !stage.handle()) return;

		const stageHandle = stage.handle();
		if (!stageHandle) return;

		const pointerPos = getRealPointerPos(stageHandle.getPointerPosition()!, stageHandle);

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
		if (!isDrawing || !stage) return;

		const stageHandle = stage.handle();

		if (!stageHandle) return;

		if (drawTimeout) {
			if (drawTimeoutRunning) {
				return;
			}

			const pointerPos = getRealPointerPos(stageHandle.getPointerPosition()!, stageHandle);

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
		if (!isDrawing) return;

		isDrawing = false;
		drawTimeout = null;
		drawTimeoutRunning = false;
	}

	function drawMouseOut(e: KonvaMouseEvent) {
		// Check if event target is stage (eg. user clicked on empty part of the stage and not any shape)
		if (e.target.getType() !== 'Stage') {
			return;
		}

		stopDraw();
	}
</script>

<div class="flex align-middle justify-around m-2">
	<div class="btn-group">
		<button
			class={selectedTool === Tools.Pen ? 'btn btn-active' : 'btn'}
			onclick={() => (selectedTool = Tools.Pen)}>Pen</button
		>
		<button
			class={selectedTool === Tools.Eraser ? 'btn btn-active' : 'btn'}
			onclick={() => (selectedTool = Tools.Eraser)}>Eraser</button
		>
	</div>
	<div class="flex flex-col justify-around align-middle">
		<span>Size:</span>
		<input type="range" min="1" max="100" bind:value={strokeWidth} class="range range-sm" />
	</div>
</div>

<ResponsiveStage
	onpointerdown={startDraw}
	onpointermove={draw}
	onpointerup={stopDraw}
	onmouseout={drawMouseOut}
	bind:stage
>
	<Layer>
		{#each strokes as stroke}
			<Line {...stroke} />
		{/each}
	</Layer>
</ResponsiveStage>
