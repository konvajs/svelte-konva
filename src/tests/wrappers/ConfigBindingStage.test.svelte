<!--
@component
Wraps the to be tested svelte-konva component so that the binding of the config prop can be tested

Special component for svelte-konva stage component, as it does only support binding on `x` and `y` props.
-->
<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	let {
		Component,
		getNode,
		staticConfig = false,
		x,
		y,
		...restProps
	}: {
		Component: any;
		x: Writable<any>;
		y: Writable<any>;
		getNode: (node: any) => void;
		staticConfig?: boolean;
		[key: string]: any;
	} = $props();

	let boundComponent: any;

	onMount(() => {
		// Once we have the Konva node of the svelte-konva component we pass it to the callback to get access to it in the test function
		getNode(boundComponent.node);
	});
</script>

<Component bind:this={boundComponent} bind:x={$x} bind:y={$y} {staticConfig} {...restProps} />
