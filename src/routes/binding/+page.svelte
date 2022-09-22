<script lang="ts">
	import type Konva from 'konva';
	import ResponsiveStage from '../ResponsiveStage.svelte';

	// svelte-konva components
	import Layer from '$lib/Layer.svelte';
	import Ring from '$lib/Ring.svelte';

	let stage: Konva.Stage;
	let layer: Konva.Layer;

	let blueRingConfig: Konva.RingConfig = {
		x: 100,
		y: 100,
		innerRadius: 100,
		outerRadius: 130,
		fill: 'blue',
		draggable: true
	};

	let redRingConfig: Konva.RingConfig = {
		x: 300,
		y: 200,
		innerRadius: 100,
		outerRadius: 130,
		fill: 'red',
		draggable: true
	};
</script>

<h3>Binding the component configuration</h3>

<div>
	<p><strong>Red Ring: </strong>x: {redRingConfig.x}, y: {redRingConfig.y}</p>
	<p><strong>Blue Ring: </strong>x: {blueRingConfig.x}, y: {blueRingConfig.y}</p>
</div>

<ResponsiveStage bind:handle={stage}>
	<Layer config={{}} bind:handle={layer}>
		<Ring config={blueRingConfig} />
		<Ring bind:config={redRingConfig} />
	</Layer>
</ResponsiveStage>

<p style="margin-top: 10px">
	svelte-konva takes advantage of the bind syntax to make it possible to automatically update the
	component's config object once said component is moved/transformed. If you do not bind the config
	of the component the config will not update. It is up to you to decide which behavior is required
	for your use-case.<br /><br />
	Try to drag the red and blue ring to observe how their respective config x and y coordinates change.
	The blue ring config is not bound while the red ring config is bound.
</p>
