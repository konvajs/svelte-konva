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
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { registerEvents } from '$lib/util/events';
	import { Container, setContainerContext } from '$lib/util/manageContext';
	import { copyExistingKeys } from '$lib/util/object';
	import { type Props, type PropsContainer, type PropsStage } from '$lib/util/props';

	let {
		children,
		config = $bindable(),
		staticConfig = false,
		handle = $bindable(),
		...restProps
	}: Props<Konva.Stage | null, Konva.ContainerConfig> & PropsContainer & PropsStage = $props();
	handle = null; // A bit of a workaround as bindings on fallback values are disallowed in runes mode (https://github.com/sveltejs/svelte/issues/9764)
	let _handle: Konva.Stage | null = null; // Hide inner handle behind a shadow variable to prevent users from overwriting it

	const inner = writable<null | Konva.Stage>(null);

	let stage: HTMLDivElement;

	let isReady = $state(false);

	$effect(() => {
		if (_handle) _handle.setAttrs(config);
	});

	onMount(() => {
		_handle = new Konva.Stage({
			container: stage,
			...config
		});

		handle = _handle;

		if (!staticConfig) {
			_handle.on('dragend', () => {
				copyExistingKeys(config, _handle!.getAttrs());
			});
		}

		registerEvents(restProps, _handle);

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

<!-- TODO: Figure out a way to split the konvaEvents from restProps (otherwise konva event hooks might also be called on div events)-->
<div bind:this={stage} {...restProps}>
	{#if isReady && children}
		{@render children()}
	{/if}
</div>
