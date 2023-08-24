# svelte-konva

[![npm](https://img.shields.io/npm/v/svelte-konva?style=flat-square)](https://www.npmjs.com/package/svelte-konva)
[![documentation](https://img.shields.io/badge/docs-svelte--konva-success?style=flat-square)](https://konvajs.org/docs/svelte)

svelte-konva is a component-based svelte wrapper for the [Konva HTML5 2D canvas library](https://github.com/konvajs/konva). For further information and examples please visit the [docs](https://konvajs.org/docs/svelte).

## Compatibility

Currently compatible with Svelte v3 & 4, SvelteKit v1 and Konva v8 & 9.

## Install

```npm
npm i svelte-konva konva
```

## Quick start

```svelte
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';
</script>

<Stage config={{ width: 1000, height: 1000 }}>
  <Layer>
    <Rect config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }} />
  </Layer>
</Stage>
```

### Events

You can listen to Konva events by using the Svelte `on:event` Syntax. All [Konva events](https://konvajs.org/docs/events/Binding_Events.html) are supported.

```svelte
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';

  function handleClick(e) {
    const konvaEvent = e.detail;
    window.alert(`Clicked on rectangle: ${konvaEvent.type}`);
  }
</script>

<Stage config={{ width: 1000, height: 1000 }}>
  <Layer>
    <Rect
      config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }}
      on:pointerclick={handleClick}
    />
  </Layer>
</Stage>
```

### Accessing the underlying Konva node

In various cases it is useful and required to be able to access the underlying Konva node object. In svelte-konva you can do this by binding the `handle` prop.

```svelte
<script>
  import { onMount, tick } from 'svelte';
  import { Stage, Layer, Rect } from 'svelte-konva';

  let rectangle;

  onMount(async () => {
    // Wait for dom update so the rectangle handle becomes defined
    await tick();

    const json = rectangle.toJSON();
    window.alert(`Rectangle as JSON: ${json}`);
  });
</script>

<Stage config={{ width: 1000, height: 1000 }}>
  <Layer>
    <Rect
      config={{ x: 100, y: 100, width: 400, height: 200, fill: 'blue' }}
      bind:handle={rectangle}
    />
  </Layer>
</Stage>
```

### Binding the config prop

By default svelte-konva keeps your config in sync (position, rotation, scale, etc.) with the Konva node after `dragend` and `transformend` events. If you bind the config prop any reactive blocks depending on the config will also be triggered once such changes happen. In case you don't want svelte-konva to sync those changes you can pass the `staticConfig` prop to the component.

```svelte
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';

  let rectangleConfig = {
    x: 100,
    y: 100,
    width: 400,
    height: 200,
    fill: 'blue',
    draggable: true
  };

  $: console.log(
    `Rectangle was dragged. New x: ${rectangleConfig.x}. New y: ${rectangleConfig.y}.`
  );
</script>

<Stage config={{ width: 1000, height: 1000 }}>
  <Layer>
    <Rect bind:config={rectangleConfig} />
  </Layer>
</Stage>
```

### Usage with SvelteKit

Generally svelte-konva is a client-side only library. When using SvelteKit, special care needs to be taken if svelte-konva/Konva functionality is used on prerendered and server side rendered (SSR) components. Prerendering and SSR happens in a Node.js environment which causes Konva to require the [canvas](https://www.npmjs.com/package/canvas) library as Konva can also be used in Node.js environments. When you use svelte-konva in such conditions you'll likely run into the following error:

> Error: Cannot find module 'canvas'

There are multiple solutions to this problem:

**Installing canvas:**

Simplest solution is to install canvas:

```npm
npm i canvas
```

This will satisfy the canvas dependency of Konva and you can use svelte-konva components in prerendered and SSR SvelteKit pages. The solution is a bit messy though, as you now have installed a package you don't really need which adds unnecessary overhead. Alternatively use one of the following solutions:

**Dynamically import your svelte-konva stage:**

A better approach is to dynamically import your svelte-konva canvas on the client-side only. Suppose you have a Svelte component containing your stage with various svelte-konva components:

_MyCanvas.svelte_

```svelte
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';
  import OtherComponentUsingSvelteKonva from './OtherComponentUsingSvelteKonva.svelte';

  const rectangleConfig = {
    /*...*/
  };
</script>

<Stage config={{ width: 1000, height: 1000 }}>
  <Layer>
    <Rect bind:config={rectangleConfig} />

    <OtherComponentUsingSvelteKonva />
  </Layer>
</Stage>
```

To use this component inside a SvelteKit prerendered/SSR page you can dynamically import it inside `onMount()` and render it using `<svelte:component>`:

_+page.svelte_

```svelte
<script>
  import { onMount } from 'svelte';
  // typescript:
  // import type MyCanvasComponent from '$lib/MyCanvas.svelte';

  let MyCanvas;
  // typescript:
  // let MyCanvas: typeof MyCanvasComponent;

  onMount(async () => {
    // Dynamically import your canvas component encapsulating all svelte-konva functionality inside onMount()
    MyCanvas = (await import('$lib/MyCanvas.svelte')).default;
  });
</script>

<div>
  <p>This is my fancy server side rendered (or prerendered) page.</p>

  <!-- Use your dynamically imported svelte-konva canvas component with a svelte:component block, you can pass any component props as usual -->
  <svelte:component this={MyCanvas} someProp="SomeString" />
</div>
```

**Dynamically import svelte-konva using vite:**

The [vite-plugin-iso-import](https://www.npmjs.com/package/vite-plugin-iso-import) allows you to make client-side only imports without needing the manual approach in `onMount()` described above. Please follow the installation instructions in the [README](https://www.npmjs.com/package/vite-plugin-iso-import) then you can dynamically import your component like so:

_+page.svelte_

```svelte
<script>
  import MyCanvasComponent from '$lib/MyCanvas.svelte?client'; // Client-side only import

  // Set component variable to null if page is rendered in SSR, otherwise use client-side only import
  let MyCanvas = import.meta.env.SSR ? null : MyCanvasComponent;
</script>

<div>
  <p>This is my fancy server side rendered (or prerendered) page.</p>

  <!-- Use your dynamically imported svelte-konva canvas component with a svelte:component block, you can pass any component props as usual -->
  <svelte:component this={MyCanvas} someProp="SomeString" />
</div>
```

Currently vite-plugin-iso-import cannot automatically fix intellisense inside .svelte files with TypeScript. Consult the [README](https://www.npmjs.com/package/vite-plugin-iso-import) for a workaround to this problem.

For further examples please consult the [docs](https://konvajs.org/docs/svelte) or clone the repo and run `npm i && npm run examples`.

## Changelog

Please refer to the [CHANGELOG.md](https://github.com/konvajs/svelte-konva/blob/master/CHANGELOG.md) or [releases](https://github.com/konvajs/svelte-konva/releases) page.
