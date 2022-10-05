<script lang="ts">
	import Code from '../../Code.svelte';
	import Group from './Group.svelte';
	import groupCode from './Group.svelte?raw';
</script>

<h2>Grouping</h2>

<p>
	Drag one of the circles and observe that the other circles are moved as well because all circles
	are grouped together
</p>

<Group />

<Code code={groupCode} />
