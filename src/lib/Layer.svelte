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

### Static config:
By default svelte-konva will automatically update your config prop on `dragend` and `transformend` events to match the config state (position, rotation, scale, ...) with the internal Konva state. 
If you additionally bind the config prop your reactive blocks will also be triggered once this happens. 
There might be cases where this behavior is not beneficial in this case you can disable it by passing the `staticConfig = true` prop to the component.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Layer.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { Container, getParentStage, setContainerContext } from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';
	import { copyExistingKeys } from './util/object';

	export let config: Konva.LayerConfig = {};
	export let handle: Konva.Layer = new Konva.Layer(config);
	export let staticConfig = false;

	let inner = writable<null | Konva.Layer>(null);

	let dispatcher = createEventDispatcher();

	let isReady = false;

	$: if (handle) {
		handle.setAttrs(config);
	}

	let parent: Writable<null | Konva.Stage> = getParentStage();

	onMount(() => {
		$parent!.add(handle);

		if (!staticConfig) {
			handle.on('transformend', () => {
				copyExistingKeys(config, handle.getAttrs());
				config = config;
			});

			handle.on('dragend', () => {
				copyExistingKeys(config, handle.getAttrs());
				config = config;
			});
		}

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
