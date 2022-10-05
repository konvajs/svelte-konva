<script lang="ts">
	import Code from '../../Code.svelte';
	import Drawing from './Drawing.svelte';
	import drawingCode from './Drawing.svelte?raw';
</script>

<h2>Free drawing</h2>

<p>Use the pen and eraser to draw on the stage</p>

<Drawing />

<Code code={drawingCode} />
