<!--
@component
The Stage component is the entry point and parent for all other svelte-konva components.
Under the hood it creates a div element where the html canvas is attached to.

### Usage:
```tsx
<Stage width={1000} height={1000}>
	Place your Layers here
</Stage>
```

### Static config:
By default svelte-konva will automatically update all changed props on `dragend` and `transformend` events to match the prop values (position, rotation, scale, ...) with the internal Konva state.
If you bind those props they will be updated automatically, otherwise no update of the changed values happens.
In cases this is not needed (eg. the respective values are not bound) or not beneficial you can disable it by passing the `staticConfig = true` prop to the component.
It is recommended to only pass `staticConfig = true` if you indeed run into performance problems connected to dragging and transforming of nodes.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Stage.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva/lib/Core';
	import type { ContainerConfig } from 'konva/lib/Container';
	import type { Stage as KonvaStage } from 'konva/lib/Stage';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { registerEvents } from '$lib/util/events';
	import { Container, setContainerContext } from '$lib/util/manageContext';
	import { type Props, type PropsContainer, type PropsStage } from '$lib/util/props';

	let {
		children,
		staticConfig = false,
		x = $bindable(),
		y = $bindable(),
		// Props forwarded to wrapper div:
		divWrapperProps,
		...restProps
	}: Props<ContainerConfig> & PropsContainer & PropsStage = $props();

	let _handle: KonvaStage | null = $state(null);
	export function handle() {
		return _handle;
	}

	const inner = writable<null | KonvaStage>(null);

	let stage: HTMLDivElement;

	let isReady = $state(false);

	onMount(() => {
		_handle = new Konva.Stage({
			container: stage,
			y,
			x,
			...restProps
		});

		if (!staticConfig) {
			const attrs = _handle.getAttrs();

			_handle.on('dragend', () => {
				if (x !== undefined) x = attrs.x;
				if (y !== undefined) y = attrs.y;
			});
		}

		Object.keys(restProps)
			.filter((e) => !e.startsWith('on')) // Do not register svelte-konva event hooks as node attributes (Currently no konva config property starts with "on" so this is the fastest and most inexpensive way to filter out the event hooks from the provided props)
			.forEach((e) => {
				$effect(() => {
					_handle!.setAttr(e, restProps[e]);
				});
			});

		// Register explicit props (not included in restProps)
		$effect(() => {
			_handle!.setAttr('x', x);
		});
		$effect(() => {
			_handle!.setAttr('y', y);
		});

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

	HTMLDivElement;
</script>

<div bind:this={stage} {...divWrapperProps}>
	{#if isReady && children}
		{@render children()}
	{/if}
</div>
