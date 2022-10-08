<!--
@component
The Stage component is the entry point and parent for all other svelte-konva components.
Under the hood it creates a div element where the html canvas is attached to.  

### Usage:
```tsx
<Stage config={{ width: 1000, height: 1000 }}>
	Place your Layers here
</Stage>
```

Further information: [Konva API docs](https://konvajs.org/api/Konva.Stage.html), [svelte-konva docs](https://teykey1.github.io/svelte-konva)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { registerEvents } from '$lib/util/events';
	import { Container, setContainerContext } from '$lib/util/manageContext';
	import { copyExistingKeys } from './util/copy';

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

		handle.on('dragend', () => {
			copyExistingKeys(config, handle!.getAttrs());
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

	setContainerContext(Container.Stage, inner);
</script>

<div bind:this={stage} {...$$restProps}>
	{#if isReady}
		<slot />
	{/if}
</div>
