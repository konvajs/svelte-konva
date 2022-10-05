<script lang="ts">
	// svelte-konva components
	import Stage from 'svelte-konva/Stage.svelte';
	import Layer from 'svelte-konva/Layer.svelte';
	import Circle from 'svelte-konva/Circle.svelte';
	import Rect from 'svelte-konva/Rect.svelte';
</script>

<Stage
	config={{
		width: 500,
		height: 500
	}}
>
	<Layer>
		<Circle
			config={{
				x: 100,
				y: 100,
				radius: 50,
				fill: 'red',
				draggable: true
			}}
		/>
		<Rect
			config={{
				x: 200,
				y: 200,
				width: 100,
				height: 100,
				fill: 'black'
			}}
		/>
	</Layer>
</Stage>
