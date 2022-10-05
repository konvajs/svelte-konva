<script lang="ts">
	import Stage from '../../ResponsiveStage.svelte';
	import type Konva from 'konva';

	// svelte-konva components
	import Layer from 'svelte-konva/Layer.svelte';
	import Rect from 'svelte-konva/Rect.svelte';
	import Line from 'svelte-konva/Line.svelte';
	import Path from 'svelte-konva/Path.svelte';

	const CLOUD_PATH =
		'M344.355,143.77c-89.868-88-242.103-39.712-264.598,83.945C34.71,234.249,0,273.123,0,319.952,c0,51.393,41.811,93.204,93.204,93.204h282.311c75.258,0,136.484-61.226,136.484-136.483,C512,189.244,430.284,123.682,344.355,143.77z';

	let clouds: Array<Konva.PathConfig> = [];

	function addCloud() {
		if (clouds.length > 30) {
			clouds = [];
		}

		let randomScale = Math.random() * 0.8 + 0.2;

		let randomX = Math.random() * 1000;
		let randomY = Math.random() * 300;

		clouds.push({
			x: randomX,
			y: randomY,
			width: 30,
			height: 30,
			data: CLOUD_PATH,
			fill: 'white',
			stroke: 'black',
			scaleX: randomScale,
			scaleY: randomScale
		});

		clouds = clouds;
	}
</script>

<Stage>
	<Layer>
		<Rect
			config={{
				x: 0,
				y: 0,
				width: 1000,
				height: 1000,
				fill: 'blue'
			}}
		/>
		<Rect
			config={{
				x: 0,
				y: 700,
				width: 1000,
				height: 1000,
				fill: 'green'
			}}
		/>

		{#each clouds as config}
			<Path {config} />
		{/each}
	</Layer>

	<Layer>
		<Rect
			config={{
				x: 300,
				y: 400,
				width: 400,
				height: 300,
				fill: 'grey'
			}}
		/>

		<Rect
			config={{
				x: 600,
				y: 280,
				width: 50,
				height: 100,
				fill: 'brown'
			}}
		/>

		<Line
			config={{
				closed: true,
				points: [300, 400, 700, 400, 500, 250],
				fill: 'brown',
				stroke: 'black',
				strokeWidth: 3
			}}
		/>

		<Rect
			config={{
				x: 350,
				y: 600,
				width: 50,
				height: 100,
				fill: 'black'
			}}
		/>

		<Rect
			config={{
				x: 550,
				y: 450,
				width: 100,
				height: 100,
				fill: 'black'
			}}
		/>
	</Layer>
</Stage>

<div class="flex items-center justify-center">
	<button on:click={addCloud} class="btn btn-secondary m-2 gap-2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z"
			/>
		</svg>

		Add clouds!
	</button>
</div>
