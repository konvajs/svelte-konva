<script lang="ts">
	import Stage from '../../ResponsiveStage.svelte';

	// svelte-konva components
	import Circle from 'svelte-konva/Circle.svelte';
	import Layer from 'svelte-konva/Layer.svelte';

	let configs = [
		{
			x: 420,
			y: 200,
			radius: 180,
			fill: 'red'
		},
		{
			x: 580,
			y: 200,
			radius: 180,
			fill: 'blue'
		},
		{
			x: 500,
			y: 280,
			radius: 180,
			fill: 'green'
		}
	];

	function shuffle() {
		configs.push(configs.shift()!);

		configs = configs;
	}
</script>

<Stage>
	<Layer>
		{#each configs as config}
			<Circle {config} />
		{/each}
	</Layer>
</Stage>

<div class="flex items-center justify-center">
	<button on:click={shuffle} class="btn btn-secondary m-2 gap-2">
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
		Shuffle!
	</button>
</div>
