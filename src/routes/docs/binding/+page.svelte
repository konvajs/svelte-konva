<script lang="ts">
	import Binding from './Binding.svelte';
	import bindingCode from './Binding.svelte?raw';
	import Code from '../../Code.svelte';
	import Warn from '../../Warn.svelte';
	import Link from '../../Link.svelte';
</script>

<h2>Binding the component configuration</h2>

<p>
	svelte-konva takes advantage of the bind syntax to make it possible to automatically update the
	component's config object once said component is moved or transformed. If you do not bind the
	config of the component the config will not automatically update.
</p>

<p>
	If the config is bound it will automatically update its existing fields if they changed on <code
		>transformend</code
	>
	and <code>dragend</code> events. If you require the config to update while dragging or
	transforming you have to implement the functionality yourself using the
	<Link href="/docs/event">konva event listeners</Link>.
</p>

<Warn>
	<p>
		The bound config will only get existing fields updated after drag or transform of the node. It
		will not update any changed fields that do not exist on the bound config object.
	</p>
	<p>
		If you provide a config with only x and y coordinates but also rotate the node while
		transforming the new rotation value will not be saved in your config object. If you want it to
		be saved then you need to define the respective fields in your config object first.
	</p>
</Warn>

<p>
	Try to drag the red and blue ring to observe how their respective config x and y coordinates
	change. The blue ring config is not bound while the red ring config is bound.
</p>

<Binding />

<Code code={bindingCode} />
