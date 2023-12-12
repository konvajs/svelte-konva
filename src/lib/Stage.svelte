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

### Static config:
By default svelte-konva will automatically update your config prop on `dragend` and `transformend` events to match the config state (position, rotation, scale, ...) with the internal Konva state. 
If you additionally bind the config prop your reactive blocks will also be triggered once this happens. 
There might be cases where this behavior is not beneficial in this case you can disable it by passing the `staticConfig = true` prop to the component.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Stage.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { registerEvents, type KonvaEvents } from '$lib/util/events';
	import { Container, setContainerContext } from '$lib/util/manageContext';
	import { copyExistingKeys } from './util/object';

	interface $$Events extends KonvaEvents {}

	export let config: Konva.ContainerConfig;
	let _handle: null | Konva.Stage = null;
	export let handle: null | Konva.Stage = _handle;
	export let staticConfig = false;

	const inner = writable<null | Konva.Stage>(null);

	let stage: HTMLDivElement;

	const dispatcher = createEventDispatcher();

	let isReady = false;

	$: if (_handle) {
		_handle.setAttrs(config);
	}

	onMount(() => {
		_handle = new Konva.Stage({
			container: stage,
			...config
		});

		handle = _handle;

		if (!staticConfig) {
			_handle.on('dragend', () => {
				copyExistingKeys(config, _handle!.getAttrs());
				config = config;
			});
		}

		registerEvents(dispatcher, _handle);

		inner.set(_handle);
		isReady = true;
	});

	onDestroy(() => {
		if (_handle) {
			_handle.destroy();
		}
	});

	setContainerContext(Container.Stage, inner);
</script>

<div bind:this={stage} {...$$restProps}>
	{#if isReady}
		<slot />
	{/if}
</div>
