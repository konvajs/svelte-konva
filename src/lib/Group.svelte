<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import {
		Container,
		getParentContainer,
		setContainerContext,
		type KonvaParent
	} from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';

	export let config: Konva.GroupConfig;
	export let handle: null | Konva.Group = null;

	let inner = writable<null | Konva.Group>(null);

	let dispatcher = createEventDispatcher();

	let isReady = false;

	$: if (handle) {
		handle.setAttrs(config);
	}

	let parent: Writable<null | KonvaParent> = getParentContainer();

	onMount(() => {
		handle = new Konva.Group(config);

		$parent!.add(handle);

		registerEvents(dispatcher, handle);

		inner.set(handle);
		isReady = true;
	});

	onDestroy(() => {
		if (handle) {
			handle.destroy();
		}
	});

	setContainerContext(Container.Layer, inner);
</script>

{#if isReady}
	<slot />
{/if}
