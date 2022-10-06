<!--
@component
The Text component needs to be placed either inside a svelte-konva Layer or Group component. 

### Usage:
```tsx
<Text config={{ x: 100, y: 100, text: "some text", fontSize: 25 }} />
```

Further information: [Konva API docs](https://konvajs.org/api/Konva.Text.html), [svelte-konva docs](https://teykey1.github.io/svelte-konva)
-->
<script lang="ts">
	import Konva from 'konva';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { registerEvents } from '$lib/util/events';
	import { getParentContainer, type KonvaParent } from '$lib/util/manageContext';
	import { copyExistingKeys } from '$lib/util/copy';

	export let config: Konva.TextConfig;
	export let handle = new Konva.Text(config);

	let parent: Writable<null | KonvaParent> = getParentContainer();
	let dispatcher = createEventDispatcher();

	$: handle.setAttrs(config);

	onMount(() => {
		$parent!.add(handle);

		handle.on('transformend', () => {
			copyExistingKeys(config, handle.getAttrs());
			config = config;
		});

		handle.on('dragend', () => {
			copyExistingKeys(config, handle.getAttrs());
			config = config;
		});

		registerEvents(dispatcher, handle);
	});

	onDestroy(() => {
		handle.destroy();
	});
</script>
