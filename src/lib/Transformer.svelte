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

### Static config:
By default svelte-konva will automatically update your config prop on `dragend` and `transformend` events to match the config state (position, rotation, scale, ...) with the internal Konva state. 
If you additionally bind the config prop your reactive blocks will also be triggered once this happens. 
There might be cases where this behavior is not beneficial in this case you can disable it by passing the `staticConfig = true` prop to the component.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Transformer.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { registerEvents, type KonvaEvents } from '$lib/util/events';
	import { getParentContainer, type KonvaParent } from '$lib/util/manageContext';
	import { copyExistingKeys } from '$lib/util/object';
	import { type Props } from '$lib/util/props';

	interface $$Events extends KonvaEvents {}

	let { config = $bindable({}), staticConfig = false }: Props<Konva.TransformerConfig | undefined> =
		$props();

	export const handle = new Konva.Transformer(config);

	const parent: Writable<null | KonvaParent> = getParentContainer();
	const dispatcher = createEventDispatcher();

	$effect(() => {
		handle.setAttrs(config);
	});

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
	});

	onDestroy(() => {
		handle.destroy();
	});
</script>
