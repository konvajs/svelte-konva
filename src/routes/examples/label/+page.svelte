<script lang="ts">
	import Code from '../../Code.svelte';

	import Label from './Label.svelte';
	import labelCode from './Label.svelte?raw';
</script>

<h2>Labels</h2>

<p>
	Creating a label is a multi-step process in Konva, as a Label instance needs to contain a Tag and
	Text instance to function. In svelte-konva the Tag and Text components can be easily nested inside
	the Label component to automatically create a correct Label.
</p>

<p>Hover over the circles to view the label in action.</p>

<Label />

<Code code={labelCode} />
