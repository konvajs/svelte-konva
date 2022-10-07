<!--
@component
The Group component needs to be placed inside a svelte-konva Layer or Group component. 

The Group component automatically groups all components that are placed inside it.

### Usage:
```tsx
<Group config={{}}>
	Place components that should be grouped here
</Group>
```

Further information: [Konva API docs](https://konvajs.org/api/Konva.Group.html), [svelte-konva docs](https://teykey1.github.io/svelte-konva)
-->
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
