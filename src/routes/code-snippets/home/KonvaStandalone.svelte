<script lang="ts">
	import Konva from 'konva';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte/types/runtime/internal/lifecycle';

	let myCircle = new Konva.Circle({
		x: 100,
		y: 100,
		radius: 50,
		fill: 'red',
		draggable: true
	});

	let myRect = new Konva.Rect({
		x: 200,
		y: 200,
		width: 100,
		height: 100,
		fill: 'green'
	});

	let layer = new Konva.Layer();

	let stage: Konva.Stage;

	onMount(() => {
		stage = new Konva.Stage({
			container: 'stage',
			width: 500,
			height: 500
		});

		layer.add(myCircle);
		layer.add(myRect);

		stage.add(layer);
	});

	onDestroy(() => {
		if (stage) {
			stage.destroy();
		}
	});
</script>

<div id="stage" />
