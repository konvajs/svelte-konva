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

By default svelte-konva keeps your config in sync (position, rotation, scale, etc.) with the Konva node after `dragend` and `transformend` events. If you bind the config prop any reactive blocks depending on the config will also be triggered once such changes happen. In case you don't want svelte-konva to sync those changes you can pass the `staticConfig` prop to the component.

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

For further examples please consult the [docs](https://konvajs.org/docs/svelte) or clone the repo and run `npm i && npm run examples`.

## Changelog

Please refer to the [CHANGELOG.md](https://github.com/konvajs/svelte-konva/blob/master/CHANGELOG.md) or [releases](https://github.com/konvajs/svelte-konva/releases) page.
