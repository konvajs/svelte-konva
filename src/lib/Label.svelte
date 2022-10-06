<!--
@component
The Label component needs to be placed either inside a svelte-konva Layer or Group component. 

To work as intended it needs to contain a Tag component as well as a Text component.

### Usage:
```tsx

```

Further information: [Konva API docs](https://konvajs.org/api/Konva.Label.html), [svelte-konva docs](https://teykey1.github.io/svelte-konva)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { copyExistingKeys } from '$lib/util/copy';
	import {
		Container,
		getParentContainer,
		setContainerContext,
		type KonvaParent
	} from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';

	export let config: Konva.LabelConfig;
	export let handle = new Konva.Label(config);

	let inner = writable<null | Konva.Label>(null);

	let dispatcher = createEventDispatcher();

	let isReady = false;

	$: handle.setAttrs(config);

	let parent: Writable<null | KonvaParent> = getParentContainer();

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

		inner.set(handle);
		isReady = true;
	});

	onDestroy(() => {
		handle.destroy();
	});

	setContainerContext(Container.Layer, inner);
</script>

{#if isReady}
	<slot />
{/if}
