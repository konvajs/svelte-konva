<script lang="ts">
	import type Konva from 'konva';
	import Stage from '../../ResponsiveStage.svelte';

	// svelte-konva components
	import Layer from 'svelte-konva/Layer.svelte';
	import Ring from 'svelte-konva/Ring.svelte';

	let stage: Konva.Stage;

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

	// Kind of a whack workaround to enable non-null assertions inside the svelte components
	$: redRingX = redRingConfig.x!;
	$: redRingY = redRingConfig.y!;
</script>

<div class="flex justify-center items-center m-2">
	<div class="stats shadow border">
		<div class="stat">
			<div class="stat-title">Red Ring</div>
			<div class="stat-value text-primary">
				x: {Math.round(redRingX)} y: {Math.round(redRingY)}
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Blue Ring</div>
			<div class="stat-value text-primary">
				x: {blueRingConfig.x} y: {blueRingConfig.y}
			</div>
		</div>
	</div>
</div>

<Stage bind:handle={stage}>
	<Layer>
		<Ring config={blueRingConfig} />
		<Ring bind:config={redRingConfig} />
	</Layer>
</Stage>
