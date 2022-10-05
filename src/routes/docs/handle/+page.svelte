<script lang="ts">
	import Code from '../../Code.svelte';
	import Handle from './Handle.svelte';
	import handleCode from './Handle.svelte?raw';
</script>

<h2>Accessing the underlying Konva object</h2>

<p>
	In a lot of cases it is required to access the underlying Konva object of a svelte-konva component
	to perform additional actions on the node. You can do this by binding the <code>handle</code> prop.
</p>

<Handle />

<Code code={handleCode} />
