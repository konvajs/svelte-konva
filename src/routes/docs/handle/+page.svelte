<script lang="ts">
	import Code from '../../Code.svelte';
	import Warn from '../../Warn.svelte';
	import Handle from './Handle.svelte';
	import handleCode from './Handle.svelte?raw';
</script>

<h2>Accessing the underlying Konva object</h2>

<p>
	In a lot of cases it is required to access the underlying Konva object of a svelte-konva component
	to perform additional actions on the node. You can do this by binding the <code>handle</code> prop.
</p>

<Warn>
	<p>
		Please note that you need to wait for a Svelte tick before being able to safely access the
		handle (It might be undefined if you do not wait). You can wait for a svelte tick by awaiting
		the promise returned by the <a href="https://svelte.dev/tutorial/tick" target="_blank"
			>Svelte `tick()` function</a
		> to do so. I am aware that this is not ideal but currently required due to the svelte-konva internals.
		This requirement might be dropped in the future.
	</p>
</Warn>

<p />

<Handle />

<Code code={handleCode} />
