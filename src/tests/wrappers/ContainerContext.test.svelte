<!--
@component
Wraps the to be tested svelte-konva component so that the context of the svelte-konva component can be tested
-->
<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { onMount } from 'svelte';
	import ContextReporter from './ContextReporter.test.svelte';

	const {
		Component,
		getHandle,
		getComponentContext,
		...restProps
	}: {
		Component: any;
		getHandle?: (handle: any) => void;
		getComponentContext: (ctx: Map<string, any>) => void;
		[key: string]: any;
	} = $props();

	let boundComponent: any;

	onMount(() => {
		// Once we have the inner component handle of the svelte-konva component we pass it to the callback to get access to it in the test function
		if (getHandle) getHandle(boundComponent.handle);
	});
</script>

<Component bind:this={boundComponent} {...restProps}>
	<ContextReporter {getComponentContext} />
</Component>
