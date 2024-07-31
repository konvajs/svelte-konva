<!--
@component
Is attached as a child component to svelte-konva containers and reports its current container context via callback for use in test functions
-->
<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	import { getContext, onMount } from 'svelte';
	import { CONTAINER_COMPONENT_KEYS } from 'svelte-konva/util/manageContext';

	const {
		getComponentContext
	}: {
		getComponentContext: (ctx: Map<string, any>) => void;
	} = $props();

	onMount(() => {
		const ctxMap = new Map();

		CONTAINER_COMPONENT_KEYS.forEach((key) => {
			ctxMap.set(key, getContext(key));
		});
		getComponentContext(ctxMap);
	});
</script>
