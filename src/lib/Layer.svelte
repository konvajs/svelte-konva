<!--
@component
The Layer component needs to be placed inside a svelte-konva Stage component. 

### Usage:
```tsx
<Stage config={{ width: 1000, height: 1000 }}>
	<Layer>
		Place your components here
	</Layer>

	You also can add multiple Layers to a Stage
</Stage>
```

Further information: [Konva API docs](https://konvajs.org/api/Konva.Layer.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { Container, getParentStage, setContainerContext } from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';
	import { copyExistingKeys } from './util/copy';

	export let config: Konva.LayerConfig = {};
	export let handle: Konva.Layer = new Konva.Layer(config);

	let inner = writable<null | Konva.Layer>(null);

	let dispatcher = createEventDispatcher();

	let isReady = false;

	$: if (handle) {
		handle.setAttrs(config);
	}

	let parent: Writable<null | Konva.Stage> = getParentStage();

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
		if (handle) {
			handle.destroy();
		}
	});

	setContainerContext(Container.Layer, inner);
</script>

{#if isReady}
	<slot />
{/if}
