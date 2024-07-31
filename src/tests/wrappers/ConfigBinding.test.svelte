<!--
@component
Wraps the to be tested svelte-konva component so that the binding of the config prop can be tested
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let {
		component,
		getHandle,
		staticConfig = false,
		x,
		y,
		scale,
		scaleX,
		scaleY,
		rotation,
		skewX,
		skewY,
		...restProps
	}: {
		component: any;
		x: Writable<any>;
		y: Writable<any>;
		scale?: Writable<any>;
		scaleX?: Writable<any>;
		scaleY?: Writable<any>;
		rotation?: Writable<any>;
		skewX?: Writable<any>;
		skewY?: Writable<any>;
		getHandle: (handle: any) => void;
		staticConfig?: boolean;
		[key: string]: any;
	} = $props();

	let boundComponent: any;

	onMount(() => {
		// Once we have the inner component handle of the svelte-konva component we pass it to the callback to get access to it in the test function
		getHandle(boundComponent.handle);
	});
</script>

<svelte:component
	this={component}
	bind:this={boundComponent}
	bind:x={$x}
	bind:y={$y}
	bind:scale={$scale}
	bind:scaleX={$scaleX}
	bind:scaleY={$scaleY}
	bind:rotation={$rotation}
	bind:skewX={$skewX}
	bind:skewY={$skewY}
	{staticConfig}
	{...restProps}
></svelte:component>
