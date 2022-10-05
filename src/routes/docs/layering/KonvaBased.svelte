<script lang="ts">
	import type Konva from 'konva';
	import Stage from '../../ResponsiveStage.svelte';

	// svelte-konva components
	import Layer from 'svelte-konva/Layer.svelte';
	import Rect from 'svelte-konva/Rect.svelte';

	const COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];

	let configs: Array<Konva.RectConfig> = [];

	let handles: Array<Konva.Rect> = [];

	let selectedColor = 0;

	$: console.log(selectedColor);
	function init() {
		for (let i = 0; i < 5; i++) {
			configs.push({
				x: i * 60 + 210,
				y: i * 36 + 40,
				width: 200,
				height: 100,
				fill: COLORS[i],
				stroke: 'black',
				strokeWidth: 4,
				draggable: true
			});
		}

		configs = configs;
	}

	init();

	function toBottom() {
		handles[selectedColor].moveToBottom();
	}

	function toTop() {
		handles[selectedColor].moveToTop();
	}

	function up() {
		handles[selectedColor].moveUp();
	}

	function down() {
		handles[selectedColor].moveDown();
	}

	function precise() {
		const answer = window.prompt(
			`Please input the desired new z-index of the ${COLORS[selectedColor]} rectangle (Integer range 0-4).`
		);

		if (!answer) {
			return;
		}

		let newZIndex = Number.parseInt(answer);

		if (isNaN(newZIndex) || newZIndex > 4 || newZIndex < 0) {
			window.alert(`Failed to parse int. Integer needs to be in the range between 0-4`);
			return;
		}

		handles[selectedColor].zIndex(newZIndex);
	}
</script>

<Stage>
	<Layer>
		{#each configs as config, i}
			<Rect bind:handle={handles[i]} {config} />
		{/each}
	</Layer>
</Stage>

<div class="flex items-center justify-center flex-row">
	<input
		style="margin: 8px;"
		type="radio"
		name="color"
		class="radio bg-red-600 checked:bg-red-700"
		bind:group={selectedColor}
		value={0}
	/>
	<input
		style="margin: 8px;"
		type="radio"
		name="color"
		class="radio bg-orange-600 checked:bg-orange-600"
		bind:group={selectedColor}
		value={1}
	/>
	<input
		style="margin: 8px;"
		type="radio"
		name="color"
		class="radio bg-yellow-400 checked:bg-yellow-400"
		bind:group={selectedColor}
		value={2}
	/>
	<input
		style="margin: 8px;"
		type="radio"
		name="color"
		class="radio bg-green-600 checked:bg-green-600"
		bind:group={selectedColor}
		value={3}
	/>
	<input
		style="margin: 8px;"
		type="radio"
		name="color"
		class="radio bg-blue-600 checked:bg-blue-600"
		bind:group={selectedColor}
		value={4}
	/>
</div>

<div class="flex items-center justify-center flex-row">
	<button on:click={toTop} class="btn btn-secondary m-2 gap-2">
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
				d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
			/>
		</svg>

		Move to top
	</button>
	<button on:click={up} class="btn btn-secondary m-2 gap-2">
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
				d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
			/>
		</svg>

		move up
	</button>
	<button on:click={down} class="btn btn-secondary m-2 gap-2">
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
				d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
			/>
		</svg>

		move down
	</button>
	<button on:click={toBottom} class="btn btn-secondary m-2 gap-2">
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
				d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
			/>
		</svg>

		move to bottom
	</button>
	<button on:click={precise} class="btn btn-secondary m-2 gap-2">
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

		move precise
	</button>
</div>
