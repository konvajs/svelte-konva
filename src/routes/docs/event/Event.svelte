<script lang="ts">
	import Stage from '../../ResponsiveStage.svelte';
	import type { KonvaEventObject } from 'konva/lib/Node';

	// svelte-konva components
	import Rect from 'svelte-konva/Rect.svelte';
	import Circle from 'svelte-konva/Circle.svelte';
	import Layer from 'svelte-konva/Layer.svelte';

	function handleCircleDblClick(e: CustomEvent<KonvaEventObject<PointerEvent>>) {
		e.preventDefault();

		window.alert('Circle has been double clicked!');
	}
</script>

<Stage on:pointerdblclick={() => window.alert('Stage has been double clicked!')}>
	<Layer on:pointerdblclick={() => window.alert('Layer has been double clicked!')}>
		<Circle
			config={{ x: 200, y: 240, radius: 120, fill: 'red' }}
			on:pointerdblclick={handleCircleDblClick}
		/>
		<Rect
			config={{ x: 40, y: 40, width: 80, height: 200, fill: 'black' }}
			on:pointerdblclick={() => window.alert('Rectangle has been double clicked!')}
		/>
	</Layer>
</Stage>
