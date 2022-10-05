<script lang="ts">
	import Stage from '../../ResponsiveStage.svelte';
	import Konva from 'konva';
	import { onDestroy, onMount, tick } from 'svelte';

	// svelte-konva components
	import Layer from 'svelte-konva/Layer.svelte';
	import Arc from 'svelte-konva/Arc.svelte';

	let arc: Konva.Arc;

	let tween: Konva.Tween;

	let isReverse = false;

	let interval: NodeJS.Timer;

	onMount(async () => {
		await tick();

		tween = new Konva.Tween({
			node: arc,
			x: 100,
			y: 100,
			scaleX: 0.5,
			scaleY: 2,
			duration: 2
		});

		interval = setInterval(() => {
			isReverse = !isReverse;
			if (!isReverse) {
				tween.play();
			} else {
				tween.reverse();
			}
		}, 3000);

		tween.play();
	});

	onDestroy(() => {
		if (tween) {
			clearInterval(interval);
			tween.destroy();
		}
	});
</script>

<Stage>
	<Layer>
		<Arc
			config={{
				x: 500,
				y: 500,
				angle: 120,
				innerRadius: 100,
				outerRadius: 300,
				fill: 'purple',
				stroke: 'yellow',
				strokeWidth: 5
			}}
			bind:handle={arc}
		/>
	</Layer>
</Stage>
