<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { registerEvents } from '$lib/util/events';
	import { Container, setContainerContext } from '$lib/util/manageContext';

	export let config: Konva.ContainerConfig;
	export let handle: null | Konva.Stage = null;

	let inner = writable<null | Konva.Stage>(null);

	let stage: HTMLDivElement;

	let dispatcher = createEventDispatcher();

	let isReady = false;

	$: if (handle) {
		handle.setAttrs(config);
	}

	onMount(() => {
		handle = new Konva.Stage({
			container: stage,
			...config
		});

		registerEvents(dispatcher, handle);

		inner.set(handle);
		isReady = true;
	});

	onDestroy(() => {
		if (handle) {
			handle.destroy();
		}
	});

	setContainerContext(Container.Stage, inner);
</script>

<div bind:this={stage}>
	{#if isReady}
		<slot />
	{/if}
</div>
