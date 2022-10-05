<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { Container, getParentStage, setContainerContext } from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';

	export let config: Konva.LayerConfig | undefined = undefined;
	export let handle: null | Konva.Layer = null;

	let inner = writable<null | Konva.Layer>(null);

	let dispatcher = createEventDispatcher();

	let isReady = false;

	$: if (handle) {
		handle.setAttrs(config);
	}

	let parent: Writable<null | Konva.Stage> = getParentStage();

	onMount(() => {
		handle = new Konva.Layer(config);

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
