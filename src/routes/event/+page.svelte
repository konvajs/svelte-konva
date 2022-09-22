<script lang="ts">
	import ResponsiveStage from '../ResponsiveStage.svelte';
	import type { KonvaEventObject } from 'konva/lib/Node';

	// svelte-konva components
	import Rect from '$lib/Rect.svelte';
	import Circle from '$lib/Circle.svelte';
	import Layer from '$lib/Layer.svelte';

	function handleCircleDblClick(e: CustomEvent<KonvaEventObject<PointerEvent>>) {
		e.preventDefault();

		window.alert('Circle has been double clicked!');
	}
</script>

<h3>Grouping</h3>

<ResponsiveStage on:pointerdblclick={() => window.alert('Stage has been double clicked!')}>
	<Layer config={{}} on:pointerdblclick={() => window.alert('Layer has been double clicked!')}>
		<Circle
			config={{ x: 200, y: 240, radius: 120, fill: 'red' }}
			on:pointerdblclick={handleCircleDblClick}
		/>
		<Rect
			config={{ x: 40, y: 40, width: 80, height: 200, fill: 'black' }}
			on:pointerdblclick={() => window.alert('Rectangle has been double clicked!')}
		/>
	</Layer>
</ResponsiveStage>

<p style="margin-top: 10px">
	You can listen to all konva events using the on:event syntax. Konva events bubble up by default.
	This behavior can be observed by double clicking the black rectangle.<br /> This means that the
	initial event is observed on the rectangle, then passed to the layer and stage which contain the
	rectangle. If such behavior is not desired you can call the preventDefault() method on the event
	object to cancel the bubbling. This is done on the event handler for the red circle. If you double
	click the red circle you can observe that the event is stopped and not propagated to the layer or
	stage.<br /> In vanilla Konva one would do this by setting the cancelBubble property of the event to
	true. Be aware that this does not work in svelte-konva and needs to be done by calling preventDefault()
</p>
