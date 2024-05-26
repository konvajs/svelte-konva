<!--
@component
Wraps the to be tested svelte-konva component so that the binding of the config prop can be tested
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	const {
		component,
		boundConfigWritable,
		getHandle,
		staticConfig = false
	}: {
		component: any;
		boundConfigWritable: Writable<any>;
		getHandle: (handle: any) => void;
		staticConfig?: boolean;
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
	bind:config={$boundConfigWritable}
	{staticConfig}
></svelte:component>
