<!--
@component
The Transformer component needs to be placed inside a svelte-konva Layer or Group component. 

In order to add shapes to the transformer you need to access the underlying Konva Transformer by binding the `handle` prop. 
Then use the `nodes()` function to add any shapes to the Transformer.

### Usage:
```tsx
<script>
	let transformer;

	transformer.nodes([someShape, otherShape]);
</script>

<Transformer bind:handle={transformer} />
```

Further information: [Konva API docs](https://konvajs.org/api/Konva.Transformer.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { registerEvents } from '$lib/util/events';
	import { getParentContainer, type KonvaParent } from '$lib/util/manageContext';
	import { copyExistingKeys } from './util/copy';

	export let config: Konva.TransformerConfig = {};
	export let handle = new Konva.Transformer(config);

	let parent: Writable<null | KonvaParent> = getParentContainer();
	let dispatcher = createEventDispatcher();

	$: if (handle) {
		handle.setAttrs(config);
	}

	onMount(() => {
		$parent!.add(handle);

		handle.on('transformend', () => {
			copyExistingKeys(config, handle.getAttrs());
			config = config;
		});

		handle.on('dragend', () => {
			copyExistingKeys(config, handle.getAttrs());
			config = config;
		});

		registerEvents(dispatcher, handle);
	});

	onDestroy(() => {
		if (handle) {
			handle.destroy();
		}
	});
</script>
