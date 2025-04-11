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
	import type { ContainerConfig } from 'konva/lib/Container';
	import { Stage as KonvaStage } from 'konva/lib/Stage';
	import { onMount, onDestroy } from 'svelte';
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

	let stage: HTMLDivElement;

	// In order to immediately have an initialized Konva Stage object we supply it with a fake div container and replace it with the real one once it is rendered to the DOM
	const fakeContainer = document.createElement('div');

	export const node = new KonvaStage({
		container: fakeContainer,
		y,
		x,
		...restProps
	});

	if (!staticConfig) {
		const attrs = node.getAttrs();

		node.on('dragend', () => {
			if (x !== undefined) x = attrs.x;
			if (y !== undefined) y = attrs.y;
		});
	}

	Object.keys(restProps)
		.filter((e) => !e.startsWith('on')) // Do not register svelte-konva event hooks as node attributes (Currently no konva config property starts with "on" so this is the fastest and most inexpensive way to filter out the event hooks from the provided props)
		.forEach((e) => {
			$effect(() => {
				node!.setAttr(e, restProps[e]);
			});
		});

	// Register explicit props (not included in restProps)
	$effect(() => {
		node!.setAttr('x', x);
	});
	$effect(() => {
		node!.setAttr('y', y);
	});

	registerEvents(restProps, node);
	setContainerContext(Container.Stage, node);

	onMount(() => {
		// mount Konva object onto real wrapper div
		node.setContainer(stage);
	});

	onDestroy(() => {
		node.destroy();
	});
</script>

<div bind:this={stage} {...divWrapperProps}>
	{@render children?.()}
</div>
