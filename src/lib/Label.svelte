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

### Static config:
By default svelte-konva will automatically update your config prop on `dragend` and `transformend` events to match the config state (position, rotation, scale, ...) with the internal Konva state. 
If you additionally bind the config prop your reactive blocks will also be triggered once this happens. 
There might be cases where this behavior is not beneficial in this case you can disable it by passing the `staticConfig = true` prop to the component.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Label.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { copyExistingKeys } from '$lib/util/object';
	import {
		Container,
		getParentContainer,
		setContainerContext,
		type KonvaParent
	} from '$lib/util/manageContext';
	import { registerEvents, type KonvaEvents } from '$lib/util/events';

	interface $$Events extends KonvaEvents {}

	export let config: Konva.LabelConfig;
	const _handle = new Konva.Label(config); // Hide inner handle behind a shadow variable to prevent users from overwriting it
	export const handle = _handle;
	export let staticConfig = false;

	const inner = writable<null | Konva.Label>(null);

	const dispatcher = createEventDispatcher();

	let isReady = false;

	$: _handle.setAttrs(config);

	const parent: Writable<null | KonvaParent> = getParentContainer();

	onMount(() => {
		$parent!.add(_handle);

		if (!staticConfig) {
			_handle.on('transformend', () => {
				copyExistingKeys(config, _handle.getAttrs());
				config = config;
			});

			_handle.on('dragend', () => {
				copyExistingKeys(config, _handle.getAttrs());
				config = config;
			});
		}

		registerEvents(dispatcher, _handle);

		inner.set(_handle);
		isReady = true;
	});

	onDestroy(() => {
		_handle.destroy();
	});

	setContainerContext(Container.Label, inner);
</script>

{#if isReady}
	<slot />
{/if}
