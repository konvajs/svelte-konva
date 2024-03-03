<!--
@component
The Group component needs to be placed inside a svelte-konva Layer or Group component. 

The Group component automatically groups all components that are placed inside it.

### Usage:
```tsx
<Group>
	Place components that should be grouped here
</Group>
```

### Static config:
By default svelte-konva will automatically update your config prop on `dragend` and `transformend` events to match the config state (position, rotation, scale, ...) with the internal Konva state. 
If you additionally bind the config prop your reactive blocks will also be triggered once this happens. 
There might be cases where this behavior is not beneficial in this case you can disable it by passing the `staticConfig = true` prop to the component.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Group.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
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
	import { registerEvents, type KonvaEvents } from '$lib/util/events';
	import { copyExistingKeys } from './util/object';

	interface $$Events extends KonvaEvents {}

	type Props = {
		config: Konva.GroupConfig;
		readonly handle?: Konva.Group;
		staticConfig?: boolean;
	};

	let { config, handle = new Konva.Group(config), staticConfig = false } = $props<Props>();

	const inner = writable<null | Konva.Group>(null);

	const dispatcher = createEventDispatcher();

	let isReady = $state(false);

	$effect(() => {
		handle.setAttrs(config);
	});

	const parent: Writable<null | KonvaParent> = getParentContainer();

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
		handle.destroy();
	});

	setContainerContext(Container.Group, inner);
</script>

{#if isReady}
	<slot />
{/if}
