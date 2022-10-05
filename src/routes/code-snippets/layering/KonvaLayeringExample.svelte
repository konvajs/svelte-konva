<script lang="ts">
	import Konva from 'konva';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';

	let myTriangle = new Konva.RegularPolygon({
		x: 150,
		y: 100,
		sides: 3,
		radius: 150,
		fill: 'black'
	});

	let myCircle = new Konva.Circle({
		x: 130,
		y: 100,
		radius: 50,
		fill: 'red'
	});

	let myRect = new Konva.Rect({
		x: 140,
		y: 100,
		width: 100,
		height: 100,
		fill: 'green'
	});

	let myRing = new Konva.Ring({
		x: 120,
		y: 160,
		innerRadius: 30,
		outerRadius: 50,
		fill: 'yellow'
	});

	let group = new Konva.Group();

	let layer = new Konva.Layer();
	let otherLayer = new Konva.Layer();

	let stage: Konva.Stage;

	onMount(() => {
		stage = new Konva.Stage({
			container: 'stage',
			width: 400,
			height: 200
		});

		// Here we attach all the created shapes and containers to the stage.
		// The order of attaching is very important as it determines the initial layering of the shapes on the canvas.
		group.add(myCircle);

		layer.add(myTriangle);

		otherLayer.add(group);
		otherLayer.add(myRing);

		group.add(myRect);

		stage.add(layer);
		stage.add(otherLayer);
	});

	onDestroy(() => {
		if (stage) {
			stage.destroy();
		}
	});
</script>

<div id="stage" />
