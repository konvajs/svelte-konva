<script lang="ts">
	import Konva from 'konva';
	import type { KonvaMouseEvent, KonvaPointerEvent, Stage } from 'svelte-konva';
	import ResponsiveStage from '../../ResponsiveStage.svelte';
	import { getRealPointerPos } from '../../util';

	// svelte-konva components
	import Circle from 'svelte-konva/Circle.svelte';
	import Layer from 'svelte-konva/Layer.svelte';
	import Group from 'svelte-konva/Group.svelte';
	import RegularPolygon from 'svelte-konva/RegularPolygon.svelte';
	import Transformer from 'svelte-konva/Transformer.svelte';
	import Rect from 'svelte-konva/Rect.svelte';

	let stage: ReturnType<typeof Stage> | undefined = $state();
	let layer: ReturnType<typeof Layer> | undefined;
	let transformer: ReturnType<typeof Transformer> | undefined;
	let selectionRectangle: ReturnType<typeof Rect> | undefined;

	const SELECTION_RECTANGLE_NAME = 'selection-rectangle';

	let configs = [
		{
			x: 800,
			y: 240,
			radius: 120,
			fill: 'red'
		},
		{
			x: 720,
			y: 80,
			radius: 120,
			fill: 'blue'
		},
		{
			x: 700,
			y: 400,
			radius: 120,
			fill: 'green'
		}
	];

	let selectionRectangleConfig = $state({
		fill: 'rgba(0,0,255,0.5)',
		visible: false,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		name: SELECTION_RECTANGLE_NAME
	});

	// Used to calculate the position and size of the selection rectangle during selection
	let initialSelectionCoordinates: Konva.Vector2d = $state({
		x: 0,
		y: 0
	});

	let selectionActive = $state(false); // If the transformer is active eg. something is selected

	function selectStart(e: KonvaPointerEvent) {
		if (!transformer || !stage) return;

		const stageNode = stage.node;

		// Check if event target is stage (eg. user clicked on empty part of the stage and not any shape)
		if (e.target.getType() !== 'Stage') {
			return;
		}

		// If there is already a selection active, cancel it
		if (selectionActive) {
			transformer.node.nodes([]);
			selectionActive = false;
			return;
		}

		const pointerPos = getRealPointerPos(stageNode.getPointerPosition()!, stageNode);

		selectionRectangleConfig.x = pointerPos.x;
		selectionRectangleConfig.y = pointerPos.y;

		initialSelectionCoordinates.x = pointerPos.x;
		initialSelectionCoordinates.y = pointerPos.y;

		selectionRectangleConfig.visible = true;
	}

	function selectDrag() {
		if (!stage) return;

		const node = stage.node;

		if (!selectionRectangleConfig.visible) {
			// Currently no selection is active (eg. user is just moving the cursor around)
			return;
		}

		const pointerPos = getRealPointerPos(node.getPointerPosition()!, node);

		// Set new x coordinate and width of selection rectangle
		selectionRectangleConfig.x = Math.min(pointerPos.x, initialSelectionCoordinates.x);
		selectionRectangleConfig.width = Math.abs(pointerPos.x - initialSelectionCoordinates.x);

		// Set new y coordinate and height of selection rectangle
		selectionRectangleConfig.y = Math.min(pointerPos.y, initialSelectionCoordinates.y);
		selectionRectangleConfig.height = Math.abs(pointerPos.y - initialSelectionCoordinates.y);
	}

	function selectEnd() {
		if (!layer || !transformer || !selectionRectangle) return;
		if (!selectionRectangleConfig.visible) {
			// Currently no selection is active (eg. user clicked on non empty part of the stage)
			return;
		}

		if (layer.node.children) {
			const selectedEntities = layer.node.children.filter(
				(child) =>
					child.name() !== SELECTION_RECTANGLE_NAME &&
					Konva.Util.haveIntersection(
						selectionRectangle!.node.getClientRect(),
						child.getClientRect()
					)
			);

			if (selectedEntities.length !== 0) {
				// Add all selected shapes etc. to the transformer
				transformer.node.nodes(selectedEntities);

				selectionActive = true;
			}
		}

		selectionRectangleConfig.visible = false;
		selectionRectangleConfig.width = 0;
		selectionRectangleConfig.height = 0;
	}

	// Cancel active selection if mouse cursor leaves stage area
	function selectMouseOut(e: KonvaMouseEvent) {
		// Check if event target is stage (eg. user clicked on empty part of the stage and not any shape)
		if (e.target.getType() !== 'Stage') {
			return;
		}

		selectEnd();
	}
</script>

<ResponsiveStage
	onpointerdown={selectStart}
	onpointermove={selectDrag}
	onpointerup={selectEnd}
	onmouseout={selectMouseOut}
	bind:stage
>
	<Layer bind:this={layer}>
		<Group draggable>
			{#each configs as _, idx}
				<Circle {...configs[idx]} />
			{/each}
		</Group>

		<Rect x={50} y={50} width={100} height={100} fill="green" draggable />

		<RegularPolygon x={400} y={300} radius={80} sides={10} fill="purple" draggable />

		<!-- Position transformer and selection rectagle at the bottom of all components so they are always the topmost elements on the canvas -->
		<Transformer bind:this={transformer} />
		<!-- The selection rectangle -->
		<Rect {...selectionRectangleConfig} bind:this={selectionRectangle} />
	</Layer>
</ResponsiveStage>
