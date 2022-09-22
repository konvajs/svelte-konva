<script lang="ts">
	import Circle from '$lib/Circle.svelte';
	import Rect from '$lib/Rect.svelte';
	import Layer from '$lib/Layer.svelte';
	import { onMount } from 'svelte';
	import type Konva from 'konva';

	import ResponsiveStage from './ResponsiveStage.svelte';

	let layerConfig = {};

	let circleConfig = {
		x: 500,
		y: 20,
		width: 30,
		hieght: 30,
		fill: 'red'
	};

	let rectConfig: Konva.RectConfig = {
		x: 100,
		y: 50,
		width: 54,
		height: 60,
		fill: 'magenta',
		rotation: 20,
		stroke: 'purple',
		dash: [10, 20, 10],
		draggable: true
	};

	let configs = [
		{
			x: 20,
			y: 20,
			width: 30,
			hieght: 30,
			fill: 'red'
		},
		{
			x: 30,
			y: 20,
			width: 30,
			hieght: 30,
			fill: 'blue'
		},
		{
			x: 25,
			y: 30,
			width: 30,
			hieght: 30,
			fill: 'green'
		}
	];

	let stage: Konva.Stage;

	onMount(() => {
		stage.on('dblclick', () => console.log('stage dblclick'));
	});

	let showCanvas = true;

	function increaseSize() {
		configs.push(configs.shift()!);

		configs = configs;
	}
</script>

<h1>Test Svelte-Konva</h1>

{#if showCanvas}
	<ResponsiveStage bind:handle={stage}>
		<Layer bind:config={layerConfig} on:dblclick={() => console.log('layer dblclick')}>
			<Circle
				bind:config={circleConfig}
				on:dblclick={(e) => {
					console.log('circle');
					e.preventDefault();
				}}
			/>
			{#each configs as config}
				<Circle bind:config />
			{/each}

			<Rect bind:config={rectConfig} />
		</Layer>
	</ResponsiveStage>
{/if}

<button on:click={increaseSize} style="margin-top: 10px">Click me</button>
