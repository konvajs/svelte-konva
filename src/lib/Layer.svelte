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
	import { registerEvents, type KonvaEvents } from '$lib/util/events';
	import { copyExistingKeys } from '$lib/util/object';
	import { type Props } from '$lib/util/props';

	interface $$Events extends KonvaEvents {}

	let { config = {}, staticConfig = false } = $props<Props<Konva.LayerConfig | undefined>>();

	export const handle = new Konva.Layer(config);

	const inner = writable<null | Konva.Layer>(null);

	const dispatcher = createEventDispatcher();

	let isReady = $state(false);

	$effect(() => {
		handle.setAttrs(config);
	});

	let parent: Writable<null | Konva.Stage> = getParentStage();

	onMount(() => {
		$parent!.add(handle);

		if (!staticConfig) {
			handle.on('transformend', () => {
				copyExistingKeys(config, handle.getAttrs());
			});

			handle.on('dragend', () => {
				copyExistingKeys(config, handle.getAttrs());
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
