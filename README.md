# svelte-konva

[![npm](https://img.shields.io/npm/v/svelte-konva?style=flat-square)](https://www.npmjs.com/package/svelte-konva)
[![documentation](https://img.shields.io/badge/docs-svelte--konva-success?style=flat-square)](https://teykey1.github.io/svelte-konva)

svelte-konva is a component-based svelte wrapper for the [Konva HTML5 2D canvas library](https://github.com/konvajs/konva). For further information and examples please visit the [docs](https://teykey1.github.io/svelte-konva).

## Compatibility

Currently compatible with Svelte v3 and Konva v8. The Library should also work for SvelteKit. This cannot be guaranteed though, as SvelteKit is still working towards a v1 release. svelte-konva aims to fully support SvelteKit v1 once it is released (For more info on SvelteKit compatability visit the [docs](https://teykey1.github.io/svelte-konva/docs/svelte-kit)).

## Install

```npm
npm i svelte-konva konva
```

## Quick start

```html
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

```html
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

```html
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

With svelte-konva you can bind the config prop of a component to have its fields automatically updated on `dragend` and `transformend` events.

```html
<script>
  import { Stage, Layer, Rect } from 'svelte-konva';

  let rectangleConfig = {
    x: 100,
    y: 100,
    width: 400,
    height: 200,
    fill: 'blue',
    draggable: true,
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

## Changelog

Please refer to the [CHANGELOG.md](https://github.com/TeyKey1/svelte-konva/blob/master/CHANGELOG.md) or [releases](https://github.com/TeyKey1/svelte-konva/releases) page.
