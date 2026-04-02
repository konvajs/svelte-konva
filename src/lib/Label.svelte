<!--
@component
The Label component needs to be placed either inside a svelte-konva Layer or Group component.

To work as intended it needs to contain a Tag component as well as a Text component in the order shown below.

### Usage:
```tsx
<Label x={100} y={100} opacity={0.8}>
	<Tag fill="black" pointerDirection="down" pointerWidth={10} pointerHeight={10} lineJoin="round" />
	<Text text="some label text" fontSize={18} padding={10} fill="white" />
</Label>
```

### Static config:
By default svelte-konva will automatically update all changed props on `dragend` and `transformend` events to match the prop values (position, rotation, scale, ...) with the internal Konva state.
If you bind those props they will be updated automatically, otherwise no update of the changed values happens.
In cases this is not needed (eg. the respective values are not bound) or not beneficial you can disable it by passing the `staticConfig = true` prop to the component.
It is recommended to only pass `staticConfig = true` if you indeed run into performance problems connected to dragging and transforming of nodes.

Further information: [Konva API docs](https://konvajs.org/api/Konva.Label.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
-->
<script lang="ts">
	import { Label as KonvaLabel, type LabelConfig } from 'konva/lib/shapes/Label';
	import { onDestroy } from 'svelte';
	import { Container, getParentContainer, setContainerContext } from '$lib/util/manageContext';
	import { registerEvents } from '$lib/util/events';
	import { type Props, type PropsContainer } from '$lib/util/props';
	import lazyEffect from './util/effect.svelte';

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
	}: Props<LabelConfig> & PropsContainer = $props();

	export const node = new KonvaLabel({
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

	// Add label to Konva parent container
	getParentContainer().add(node);

	if (!staticConfig) {
		const attrs = node.getAttrs();

		node.on('transformend', () => {
			if (x !== undefined) x = attrs.x;
			if (y !== undefined) y = attrs.y;
			if (scale !== undefined) scale = attrs.scale;
			if (scaleX !== undefined) scaleX = attrs.scaleX;
			if (scaleY !== undefined) scaleY = attrs.scaleY;
			if (rotation !== undefined) rotation = attrs.rotation;
			if (skewX !== undefined) skewX = attrs.skewX;
			if (skewY !== undefined) skewY = attrs.skewY;
		});

		node.on('dragend', () => {
			if (x !== undefined) x = attrs.x;
			if (y !== undefined) y = attrs.y;
		});
	}

	Object.keys(restProps)
		.filter((e) => !e.startsWith('on')) // Do not register svelte-konva event hooks as node attributes (Currently no konva config property starts with "on" so this is the fastest and most inexpensive way to filter out the event hooks from the provided props)
		.forEach((e) => {
			$effect(() => {
				node.setAttr(e, restProps[e]);
			});
		});

	// Register explicit props (not included in restProps)
	// Those props are registered using lazy $effects to prevent
	// the initial $effect exection from affecting Konva internals
	lazyEffect((skip) => {
		if (skip) {
			x; // Dummy read to register dependency
			return;
		}
		node.setAttr('x', x);
	})();
	lazyEffect((skip) => {
		if (skip) {
			y;
			return;
		}
		node.setAttr('y', y);
	})();
	lazyEffect((skip) => {
		if (skip) {
			scale;
			return;
		}
		node.setAttr('scale', scale);
	})();
	lazyEffect((skip) => {
		if (skip) {
			scaleX;
			return;
		}
		node.setAttr('scaleX', scaleX);
	})();
	lazyEffect((skip) => {
		if (skip) {
			scaleY;
			return;
		}
		node.setAttr('scaleY', scaleY);
	})();
	lazyEffect((skip) => {
		if (skip) {
			rotation;
			return;
		}
		node.setAttr('rotation', rotation);
	})();
	lazyEffect((skip) => {
		if (skip) {
			skewX;
			return;
		}
		node.setAttr('skewX', skewX);
	})();
	lazyEffect((skip) => {
		if (skip) {
			skewY;
			return;
		}
		node.setAttr('skewY', skewY);
	})();

	registerEvents(restProps, node);
	setContainerContext(Container.Label, node);

	onDestroy(() => {
		node.destroy();
	});
</script>

{@render children?.()}
