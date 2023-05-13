<!--
@component
The Label component needs to be placed either inside a svelte-konva Layer or Group component. 

To work as intended it needs to contain a Tag component as well as a Text component in the order shown below.

### Usage:
```tsx
<Label config={{x: 100, y: 100, opacity: 0.8}}>
	<Tag config={{fill: "black", pointerDirection: "down", pointerWidth: 10, pointerHeight: 10, lineJoin: "round" }} />
	<Text config={{ text: "some label text", fontSize: 18, padding: 10, fill: "white" }} />
</Label>
```

Further information: [Konva API docs](https://konvajs.org/api/Konva.Label.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
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

	setContainerContext(Container.Label, inner);
</script>

{#if isReady}
	<slot />
{/if}
