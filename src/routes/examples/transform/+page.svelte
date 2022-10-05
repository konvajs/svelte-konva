<script lang="ts">
	import Code from '../../Code.svelte';
	import Transform from './Transform.svelte';
	import transformCode from './Transform.svelte?raw';
</script>

<h2>Select and transform</h2>

<p>Drag to select a shape or group and transform it</p>

<Transform />

<Code code={transformCode} />
