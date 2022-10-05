<script lang="ts">
	import Stage from '../../ResponsiveStage.svelte';

	// svelte-konva components
	import Layer from 'svelte-konva/Layer.svelte';
	import Rect from 'svelte-konva/Rect.svelte';
	import Text from 'svelte-konva/Text.svelte';
	import Circle from 'svelte-konva/Circle.svelte';

	let components = [
		{
			type: Rect,
			config: {
				x: 250,
				y: 300,
				width: 500,
				height: 250,
				fill: 'green'
			}
		},
		{
			type: Circle,
			config: {
				x: 420,
				y: 200,
				radius: 180,
				fill: 'red'
			}
		},
		{
			type: Circle,
			config: {
				x: 580,
				y: 200,
				radius: 180,
				fill: 'blue'
			}
		}
	];

	// This flag signals any change in the layering and triggers the key block for rerendering
	let layeringChanged = false;

	// shifts the components of the components array
	function shift() {
		components.push(components.shift()!);

		components = components;

		// trigger a rerender
		layeringChanged = !layeringChanged;
	}
</script>

<Stage>
	<Layer>
		<!-- Both each block and the text component are wrapped as we want to ensure that the text 
            block is always on top, even when the content of the each block gets rerendered -->
		{#key layeringChanged}
			{#each components as component}
				<svelte:component this={component.type} bind:config={component.config} />
			{/each}

			<Text
				config={{
					x: 250,
					y: 300,
					width: 500,
					align: 'center',
					text: 'Some important information which needs to stay on top',
					fontSize: 30,
					fontFamily: 'Calibri',
					fill: 'yellow'
				}}
			/>
		{/key}
	</Layer>
</Stage>

<div class="flex items-center justify-center">
	<button on:click={shift} class="btn btn-secondary m-2 gap-2">
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
				d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
			/>
		</svg>
		Shift!
	</button>
</div>
