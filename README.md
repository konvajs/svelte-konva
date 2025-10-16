# svelte-konva

[![npm](https://img.shields.io/npm/v/svelte-konva?style=flat-square)](https://www.npmjs.com/package/svelte-konva)
[![documentation](https://img.shields.io/badge/docs-svelte--konva-success?style=flat-square)](https://konvajs.org/docs/svelte)

svelte-konva is a component-based svelte wrapper for the [Konva HTML5 2D canvas library](https://github.com/konvajs/konva). For further information and examples please visit the [docs](https://konvajs.org/docs/svelte).

## Compatibility

Refer to the following table for a compatibility overview:

| Svelte | Konva | svelte-konva | _notes_                                                |
| ------ | ----- | ------------ | ------------------------------------------------------ |
| v5     | v8-10 | v1           | [migration guide](./docs/svelte-konva-v1-migration.md) |
| v3-4   | v8-9  | v0.3         | [v0 docs](./docs/svelte-konva-v0-guide.md)             |

## Install

```npm
npm i svelte-konva konva
```

## Quick start

```svelte
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';
</script>

<Stage width={1000} height={1000}>
  <Layer>
    <Rect x={100} y={100} width={400} height={200} fill="blue" />
  </Layer>
</Stage>
```

### Events

You can listen to Konva events by using callback props named `on{konva event name}`. All [Konva events](https://konvajs.org/docs/events/Binding_Events.html) are supported.

```svelte
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';

  function handleClick(e) {
    window.alert(`Clicked on rectangle: ${e.type}`);
  }
</script>

<Stage width={1000} height={1000}>
  <Layer>
    <Rect x={100} y={100} width={400} height={200} fill="blue" onpointerclick={handleClick} />
  </Layer>
</Stage>
```

### Accessing the underlying Konva node

In some cases you might need to access the underlying Konva node of the svelte-konva component directly. You can do this by accessing the `node` property of the corresponding component instance (example below) or by accessing it in the payload of a Konva event.

```svelte
<script>
  import { onMount } from 'svelte';
  import { Stage, Layer, Rect } from 'svelte-konva';

  let rectangle;

  onMount(async () => {
    const json = rectangle.node.toJSON();
    window.alert(`Rectangle as JSON: ${json}`);
  });
</script>

<Stage width={1000} height={1000}>
  <Layer>
    <Rect x={100} y={100} width={400} height={200} fill="blue" bind:this={rectangle} />
  </Layer>
</Stage>
```

### Binding the config prop

Svelte-Konva is able to keep certain props in sync with the internal state of Konva (position, rotation, scale, ...) after `dragend` and `transformend` events in case the prop is bound. In case you don't want svelte-konva to sync those changes internally (mainly due to performance reasons) you can pass the `staticConfig` prop to the component.

```svelte
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';

  let rectX = $state(100);
  let rectY = $state(100);

  $effect(() => {
    console.log(`Rectangle was dragged. New x: ${rectX}. New y: ${rectY}.`);
  });
</script>

<Stage width={1000} height={1000}>
  <Layer>
    <Rect bind:x={rectX} bind:y={rectY} width={400} height={200} fill="blue" draggable />
  </Layer>
</Stage>
```

### Usage with SvelteKit

Generally, svelte-konva is a client-side only library. When using SvelteKit, special care needs to be taken if svelte-konva/Konva functionality is used on prerendered and server side rendered (SSR) components. Prerendering and SSR happens in a Node.js environment. In case you use any svelte-konva functionality in such a context it will throw an error on the server:

> Error: svelte-konva: Library can only be used in a browser context but is currently used in a server environment.

There are multiple solutions to this problem:

**Wrap your svelte-konva Components into browser checks**

A rudimental solution is to wrap all your svelte-konva code into SvelteKit browser checks. This is only recommended in case your project is small as all the if-blocks can get messy quickly. For larger projects use dynamic imports outlined below.

```html
<script>
  import { browser } from '$app/environment';
  import { Stage, Layer, Rect } from 'svelte-konva';
</script>

{#if browser}
<Stage width="{1000}" height="{1000}">
  <Layer>
    <Rect x="{100}" y="{100}" width="{400}" height="{200}" fill="blue" />
  </Layer>
</Stage>
{/if}
```

**Dynamically import your svelte-konva stage:**

A better approach is to dynamically import your svelte-konva canvas on the client-side only. Suppose you have a Svelte component containing your stage with various svelte-konva components:

_MyCanvas.svelte_

```html
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';
  import OtherComponentUsingSvelteKonva from './OtherComponentUsingSvelteKonva.svelte';

  const rectangleConfig = {
    /*...*/
  };
</script>

<Stage width="{1000}" height="{1000}">
  <Layer>
    <Rect {...rectangleConfig} />

    <OtherComponentUsingSvelteKonva />
  </Layer>
</Stage>
```

To use this component inside a SvelteKit prerendered/SSR page you can dynamically import it inside `onMount()` and render it once it becomes defined:

_+page.svelte_

```html
<script>
  import { browser } from '$app/environment';

  const MyCanvas = browser
    ? import('./MyCanvas.svelte').then((module) => module.default)
    : new Promise(() => {});
</script>

<div>
  <p>This is my fancy server side rendered (or prerendered) page.</p>

  <!-- Use your dynamically imported svelte-konva canvas component once it becomes defined, you can pass any component props as usual -->
  {#await MyCanvas}
  <p>Loading...</p>
  {:then Component}
  <Component someProp="someString" />
  {:catch error}
  <p>Something went wrong: {error.message}</p>
  {/await}
</div>
```

For further examples please consult the [docs](https://konvajs.org/docs/svelte) or clone the repo and run `npm i && npm run examples`.

## Changelog

Please refer to the [CHANGELOG.md](https://github.com/konvajs/svelte-konva/blob/master/CHANGELOG.md) or [releases](https://github.com/konvajs/svelte-konva/releases) page.
