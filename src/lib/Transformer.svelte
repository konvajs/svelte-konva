<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { registerEvents } from '$lib/util/events';
	import { getParentContainer, type KonvaParent } from '$lib/util/manageContext';

	export let config: Konva.TransformerConfig | undefined = undefined;
	export let handle: null | Konva.Transformer = null;

	let parent: Writable<null | KonvaParent> = getParentContainer();
	let dispatcher = createEventDispatcher();

	$: if (handle) {
		handle.setAttrs(config);
	}

	onMount(() => {
		handle = new Konva.Transformer(config);

		$parent!.add(handle);

		registerEvents(dispatcher, handle);
	});

	onDestroy(() => {
		if (handle) {
			handle.destroy();
		}
	});
</script>
