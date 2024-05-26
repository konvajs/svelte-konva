<!--
@component
Wraps the to be tested svelte-konva component so that the context of the svelte-konva component can be tested
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import ContextReporter from './ContextReporter.test.svelte';

	const {
		component,
		config,
		getHandle,
		getComponentContext
	}: {
		component: any;
		config?: any;
		getHandle?: (handle: any) => void;
		getComponentContext: (ctx: Map<string, any>) => void;
	} = $props();

	let boundComponent: any;

	onMount(() => {
		// Once we have the inner component handle of the svelte-konva component we pass it to the callback to get access to it in the test function
		if (getHandle) getHandle(boundComponent.handle);
	});
</script>

<svelte:component this={component} bind:this={boundComponent} {config}>
	<ContextReporter {getComponentContext} />
</svelte:component>
