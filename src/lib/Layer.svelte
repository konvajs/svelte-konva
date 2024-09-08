<!--
@component
The Layer component needs to be placed inside a svelte-konva Stage component.

### Usage:
```tsx
<Stage width={1000} height={1000}>
	<Layer>
		Place your components here
	</Layer>

	You also can add multiple Layers to a Stage
</Stage>
```

### Static config:
By default svelte-konva will automatically update all changed props on `dragend` and `transformend` events to match the prop values (position, rotation, scale, ...) with the internal Konva state.
If you bind those props they will be updated automatically, otherwise no update of the changed values happens.
In cases this is not needed (eg. the respective values are not bound) or not beneficial you can disable it by passing the `staticConfig = true` prop to the component.
It is recommended to only pass `staticConfig = true` if you indeed run into performance problems connected to dragging and transforming of nodes.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Layer.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import Konva from 'konva/lib/Core';
	import type { Stage } from 'konva/lib/Stage';
	import type { Layer, LayerConfig } from 'konva/lib/Layer';
	import { onMount, onDestroy } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { Container, getParentStage, setContainerContext } from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';
	import { type PropsContainer, type Props } from '$lib/util/props';

	let {
		children,
		staticConfig = false,
		x = $bindable(),
		y = $bindable(),
		scale = $bindable(),
		scaleX = $bindable(),
		scaleY = $bindable(),
		rotation = $bindable(),
		skewX = $bindable(),
		skewY = $bindable(),
		...restProps
	}: Props<LayerConfig> & PropsContainer = $props();

	export const handle = new Konva.Layer({
		x,
		y,
		scale,
		scaleX,
		scaleY,
		rotation,
		skewX,
		skewY,
		...restProps
	});

	const inner = writable<null | Layer>(null);

	let isReady = $state(false);

	let parent: Writable<null | Stage> = getParentStage();

	onMount(() => {
		$parent!.add(handle);

		if (!staticConfig) {
			const attrs = handle.getAttrs();

			handle.on('transformend', () => {
				if (x !== undefined) x = attrs.x;
				if (y !== undefined) y = attrs.y;
				if (scale !== undefined) scale = attrs.scale;
				if (scaleX !== undefined) scaleX = attrs.scaleX;
				if (scaleY !== undefined) scaleY = attrs.scaleY;
				if (rotation !== undefined) rotation = attrs.rotation;
				if (skewX !== undefined) skewX = attrs.skewX;
				if (skewY !== undefined) skewY = attrs.skewY;
			});

			handle.on('dragend', () => {
				if (x !== undefined) x = attrs.x;
				if (y !== undefined) y = attrs.y;
			});
		}

		Object.keys(restProps)
			.filter((e) => !e.startsWith('on')) // Do not register svelte-konva event hooks as node attributes (Currently no konva config property starts with "on" so this is the fastest and most inexpensive way to filter out the event hooks from the provided props)
			.forEach((e) => {
				$effect(() => {
					handle.setAttr(e, restProps[e]);
				});
			});

		// Register explicit props (not included in restProps)
		$effect(() => {
			handle.setAttr('x', x);
		});
		$effect(() => {
			handle.setAttr('y', y);
		});
		$effect(() => {
			handle.setAttr('scale', scale);
		});
		$effect(() => {
			handle.setAttr('scaleX', scaleX);
		});
		$effect(() => {
			handle.setAttr('scaleY', scaleY);
		});
		$effect(() => {
			handle.setAttr('rotation', rotation);
		});
		$effect(() => {
			handle.setAttr('skewX', skewX);
		});
		$effect(() => {
			handle.setAttr('skewY', skewY);
		});

		registerEvents(restProps, handle);

		inner.set(handle);
		isReady = true;
	});

	onDestroy(() => {
		handle.destroy();
	});

	setContainerContext(Container.Layer, inner);
</script>

{#if isReady && children}
	{@render children()}
{/if}
