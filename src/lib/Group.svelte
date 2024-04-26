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
	import { onMount, onDestroy } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import {
		Container,
		getParentContainer,
		setContainerContext,
		type KonvaParent
	} from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';
	import { copyExistingKeys } from '$lib/util/object';
	import { type PropsContainer, type PropsOptionalConfig } from '$lib/util/props';

	let {
		children,
		config = $bindable({}),
		staticConfig = false,
		handle = $bindable(),
		...eventHooks
	}: PropsOptionalConfig<Konva.Group, Konva.GroupConfig> & PropsContainer = $props();

	// Hide inner handle behind a shadow variable to prevent users from overwriting it
	const _handle = new Konva.Group(config);
	handle = _handle;

	const inner = writable<null | Konva.Group>(null);

	let isReady = $state(false);

	$effect(() => {
		_handle.setAttrs(config);
	});

	const parent: Writable<null | KonvaParent> = getParentContainer();

	onMount(() => {
		$parent!.add(_handle);

		if (!staticConfig) {
			_handle.on('transformend', () => {
				copyExistingKeys(config, _handle.getAttrs());
			});

			_handle.on('dragend', () => {
				copyExistingKeys(config, _handle.getAttrs());
			});
		}

		registerEvents(eventHooks, _handle);

		inner.set(_handle);
		isReady = true;
	});

	onDestroy(() => {
		_handle.destroy();
	});

	setContainerContext(Container.Group, inner);
</script>

{#if isReady && children}
	{@render children()}
{/if}
