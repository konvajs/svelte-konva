# Migration to svelte-konva v1

The following document outlines all breaking changes for svelte-konva v1 and how to migrate from svelte-konva v0.

## `config` prop is now splitted into individual props

In svelte-konva v0 the `config` prop contained an object whith all configurabe properties of a Konva node (similar to [vue-konva](https://github.com/konvajs/vue-konva)). With v1 this has now been changed so that the properties of the konva Node are now exposed directly as individual props (similar to [react-konva](https://github.com/konvajs/react-konva)):

```diff
<Rect
-      config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }}
+      x={100} y={100} width={400} height={200} fill="blue"
/>
```

### Migration examples

As this is a big API change that requires manual migration work, the most common migration examples are outlined in the examples below:

**Spreading the old config object:**

```diff
<script>
  let config = {
    x: 100,
    y: 100,
    width: 400,
    height: 200,
    fill: 'blue'
  };
</script>

<Rect
-      {config}
+      {...config}
/>
```

**Bound config prop:**

```diff
<script>
  let config = $state({
    x: 100,
    y: 100,
    width: 400,
    height: 200,
    fill: 'blue',
    draggable: true
  });
</script>

<Rect
-      bind:config
+      {...config}
+      bind:x={config.x}
+      bind:y={config.y}
/>
```

You can also bind other properties such as `skewX`, `scaleY`, `rotation`, etc. to receive updates after transformation of the shape.

### Why this was changed:

There are some important reasons that warrant this change, namely:

- By splitting the config prop into individual props svelte-konva can fully leverage the "fine-grainded reactivity" approach of Svelte 5. Changes to an individual configuration property do not lead to the invalidation of the entire configuration.
- Binding/not binding the `config` prop has always had certain caveats and hard to understand side-effects such as changes to properties of the `config` prop made by svelte-konva "leaking" into user code even when the `config` prop was not bound. With splitted props this can no longer happen and binding individual props is now clearly defined and limited to props that can actually be modified by svelte-konva. No more leaking/unexpected changes coming from svelte-konva code if the respective prop is not bound.
- The change brings svelte-konva API-wise more in line with other popular Svelte component libraries (such as [threlte](https://github.com/threlte/threlte))

## Event handlers

In Svelte v5 usage of the `on:event` syntax is deprecated. svelte-konva provides all Konva events now as callback props using the `on<konva event name>` syntax. The deprecated `on:event` syntax will no longer work for svelte-konva events:

```diff
<Rect
     x={100} y={100} width={400} height={200} fill="blue"
-    on:pointerclick={handleClick}
+    onpointerclick={handleClick}
/>
```

### Event payloads

Additionally the event payload data has changed. Instead of being wrapped in a `CustomEvent` under the `detail` property the whole Konva event payload is now directly accessible:

```diff
function handleClick(e) {
-    const konvaEvent = e.detail;
-    window.alert(`Clicked on rectangle: ${konvaEvent.type}`);
+    window.alert(`Clicked on rectangle: ${e.type}`);
}
```

## Accessing the underlying Konva handle

The way to access the corresponding Konva handle in a svelte-konva component has changed. You can no longer bind the `handle` prop to access it. Instead `handle` is now exposed directly on the component instance. To access it use `bind:this` and then access the `handle` property on the component object:

```diff
<script>
  import { onMount, tick } from 'svelte';
  import { Stage, Layer, Rect } from 'svelte-konva';

  let rectangle;

  onMount(async () => {
-    // Wait for dom update so the rectangle handle becomes defined
-    await tick();
-
-    const json = rectangle.toJSON();
+    const json = rectangle.handle.toJSON();
     window.alert(`Rectangle as JSON: ${json}`);
  });
</script>

<Stage width={1000} height={1000}>
  <Layer>
    <Rect
       x={100} y={100} width={400} height={200} fill="blue"
-      bind:handle={rectangle}
+      bind:this={rectangle}
    />
  </Layer>
</Stage>
```

Additionally, you no longer need to wait a tick before accessing `handle` as it will be immediately defined on component instantiation.

## Stage handle

The stage `handle` needs special treatment, as it only becomes defined once the canvas HTML element has been rendered to the DOM. Due to this, the `handle` property on the stage component is a function which can be called to retrieve the Konva handle. It returns `null` if the stage object has not been created yet:

```svelte
<script>
	import { onMount, tick } from 'svelte';
	import { Stage, Layer, Rect } from 'svelte-konva';

	let stage;

	onMount(async () => {
		// Wait for dom update so the stage handle becomes defined
		await tick();

		const json = stage.handle().toJSON(); // Caution: handle() can return null if the stage has not been created yet (eg. canvas HTML component has not yet been rendered)
		window.alert(`Stage as JSON: ${json}`);
	});
</script>

<Stage width={1000} height={1000} bind:this={stage}>
	<Layer>
		<Rect x={100} y={100} width={400} height={200} fill="blue" />
	</Layer>
</Stage>
```

## Passing props to the wrapping stage div

When using the svelte-konva `Stage` component, svelte-konva automatically creates a HTML div element which contains the Konva stage. Previously you could pass props to this div by using the rest props on the `Stage` component. With v1 this is changed such that you can now pass props directly using the new `divWrapperProps` prop on the `Stage` component. It accepts an object containing all props that are directly passed to the wrapper div:

```diff
<Stage
     width={1000} height={1000} bind:this={stage}
-    id="myWrapperDiv"
-    class="wrapperDivClass otherClass"
+    divWrapperProps={{
       id: "myWrapperDiv",
       class: "wrapperDivClass otherClass"
     }}
>
</Stage>
```

This has been changed due to Konva configuration props colliding with certain div props (for example `id`) which made it impossible to distinguish whether the prop was aimed at the Konva node or the div wrapper.

## Svelte runes-only mode

svelte-konva is now fully compatible with Svelte's runes-only compile mode which means it will work out of the box for runes-only projects. It will also continue to work for all projects without runes-only mode enabled.

## Changes to `config` prop reactivity

TBD
