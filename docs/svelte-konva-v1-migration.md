# Migration to svelte-konva v1

## Event handlers

In Svelte v5 usage of the `on:event` syntax is deprecated. svelte-konva provides all Konva events now as callback props using the `on<konva event name>` syntax. The deprecated `on:event` syntax will no longer work for svelte-konva events:

```diff
<Rect
    config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }}
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

<Stage config={{ width: 1000, height: 1000 }}>
  <Layer>
    <Rect
      config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }}
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

<Stage config={{ width: 1000, height: 1000 }} bind:this={stage}>
	<Layer>
		<Rect config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }} />
	</Layer>
</Stage>
```

## Svelte runes-only mode

svelte-konva is now fully compatible with Svelte's runes-only compile mode which means it will work out of the box for runes-only projects. It will also continue to work for all projects without runes-only mode enabled.

## Changes to `config` prop reactivity

TBD
