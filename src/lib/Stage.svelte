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
	import { type Props, type PropsContainer, type PropsStage } from '$lib/util/props';

	let {
		children,
		staticConfig = false,
		onclick,
		ondblclick,
		ondbltap,
		ondragend,
		ondragmove,
		ondragstart,
		onmousedown,
		onmouseenter,
		onmouseleave,
		onmousemove,
		onmouseout,
		onmouseover,
		onmouseup,
		onpointercancel,
		onpointerclick,
		onpointerdblclick,
		onpointerdown,
		onpointerenter,
		onpointerleave,
		onpointermove,
		onpointerout,
		onpointerover,
		onpointerup,
		ontap,
		ontouchend,
		ontouchmove,
		ontouchstart,
		ontransform,
		ontransformend,
		ontransformstart,
		onwheel,
		y,
		x,
		width,
		visible,
		skewY,
		skewX,
		scaleY,
		scaleX,
		scale,
		rotation,
		preventDefault,
		opacity,
		offsetY,
		offsetX,
		offset,
		name,
		listening,
		id,
		height,
		globalCompositeOperation,
		filters,
		draggable,
		dragDistance,
		dragBoundFunc,
		clipY,
		clipX,
		clipWidth,
		clipHeight,
		clearBeforeDraw,
		clipFunc,
		...restProps
	}: Props<Konva.ContainerConfig> & PropsContainer & PropsStage = $props();

	let _handle: Konva.Stage | null = $state(null);
	export function handle() {
		return _handle;
	}

	const inner = writable<null | Konva.Stage>(null);

	let stage: HTMLDivElement;

	let isReady = $state(false);

	onMount(() => {
		console.log(x, y);
		_handle = new Konva.Stage({
			container: stage,
			y,
			x,
			width,
			visible,
			skewY,
			skewX,
			scaleY,
			scaleX,
			scale,
			rotation,
			preventDefault,
			opacity,
			offsetY,
			offsetX,
			offset,
			name,
			listening,
			id,
			height,
			globalCompositeOperation,
			filters,
			draggable,
			dragDistance,
			dragBoundFunc,
			clipY,
			clipX,
			clipWidth,
			clipHeight,
			clearBeforeDraw,
			clipFunc
		});

		if (!staticConfig) {
			const attrs = _handle.getAttrs();

			_handle.on('dragend', () => {
				if (x !== undefined) x = attrs.x;
				if (y !== undefined) y = attrs.y;
			});
		}

		$effect(() => {
			_handle!.setAttr('x', x);
		});
		$effect(() => {
			_handle!.setAttr('y', y);
		});
		$effect(() => {
			_handle!.setAttr('width', width);
			console.log('stage change width', width);
		});
		$effect(() => {
			_handle!.setAttr('visible', visible);
		});
		$effect(() => {
			_handle!.setAttr('skewY', skewY);
		});
		$effect(() => {
			_handle!.setAttr('skewX', skewX);
		});
		$effect(() => {
			_handle!.setAttr('scaleY', scaleY);
		});
		$effect(() => {
			_handle!.setAttr('scaleX', scaleX);
		});
		$effect(() => {
			_handle!.setAttr('scale', scale);
		});
		$effect(() => {
			_handle!.setAttr('rotation', rotation);
		});
		$effect(() => {
			_handle!.setAttr('preventDefault', preventDefault);
		});
		$effect(() => {
			_handle!.setAttr('opacity', opacity);
		});
		$effect(() => {
			_handle!.setAttr('offsetY', offsetY);
		});
		$effect(() => {
			_handle!.setAttr('offsetX', offsetX);
		});
		$effect(() => {
			_handle!.setAttr('offset', offset);
		});
		$effect(() => {
			_handle!.setAttr('name', name);
		});
		$effect(() => {
			_handle!.setAttr('listening', listening);
		});
		$effect(() => {
			_handle!.setAttr('id', id);
		});
		$effect(() => {
			_handle!.setAttr('height', height);
		});
		$effect(() => {
			_handle!.setAttr('globalCompositeOperation', globalCompositeOperation);
		});
		$effect(() => {
			_handle!.setAttr('filters', filters);
		});
		$effect(() => {
			_handle!.setAttr('draggable', draggable);
		});
		$effect(() => {
			_handle!.setAttr('dragDistance', dragDistance);
		});
		$effect(() => {
			_handle!.setAttr('dragBoundFunc', dragBoundFunc);
		});
		$effect(() => {
			_handle!.setAttr('clipY', clipY);
		});
		$effect(() => {
			_handle!.setAttr('clipX', clipX);
		});
		$effect(() => {
			_handle!.setAttr('clipWidth', clipWidth);
		});
		$effect(() => {
			_handle!.setAttr('clipHeight', clipHeight);
		});
		$effect(() => {
			_handle!.setAttr('clearBeforeDraw', clearBeforeDraw);
		});
		$effect(() => {
			_handle!.setAttr('clipFunc', clipFunc);
		});

		registerEvents(
			{
				onclick,
				ondblclick,
				ondbltap,
				ondragend,
				ondragmove,
				ondragstart,
				onmousedown,
				onmouseenter,
				onmouseleave,
				onmousemove,
				onmouseout,
				onmouseover,
				onmouseup,
				onpointercancel,
				onpointerclick,
				onpointerdblclick,
				onpointerdown,
				onpointerenter,
				onpointerleave,
				onpointermove,
				onpointerout,
				onpointerover,
				onpointerup,
				ontap,
				ontouchend,
				ontouchmove,
				ontouchstart,
				ontransform,
				ontransformend,
				ontransformstart,
				onwheel
			},
			_handle
		);

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

<div bind:this={stage} {...restProps}>
	{#if isReady && children}
		{@render children()}
	{/if}
</div>
