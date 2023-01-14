<script lang="ts">
	// snippets
	import CodeSnippet from './CodeSnippet.svelte';
	import KonvaStandalone from './code-snippets/home/KonvaStandalone.svelte?raw';
	import SvelteKonvaStandalone from './code-snippets/home/SvelteKonvaStandalone.svelte?raw';
</script>

<h1>Svelte-Konva</h1>

<p>
	svelte-konva is a component based Svelte wrapper for the <a
		href="https://konvajs.org/"
		target="_blank"
		rel="noreferrer">Konva</a
	>
	HTML 5 2D canvas library. It provides Svelte-components for the following shapes and containers:
	<code>Stage</code> <code>Layer</code> <code>Group</code> <code>Arc</code> <code>Arrow</code>
	<code>Circle</code> <code>Ellipse</code> <code>Image</code> <code>Label</code>
	<code>Line</code> <code>Path</code> <code>Rect</code> <code>RegularPolygon</code>
	<code>Ring</code> <code>Shape</code> <code>Sprite</code> <code>Star</code> <code>Text</code>
	<code>TextPath</code> <code>Transformer</code> <code>Wedge</code> <code>Tag</code>
</p>

<p>
	This documentation covers all things related to svelte-konva. For developing with svelte-konva it
	is also required to be familiar with Konva itself. Konva offers various sources of documentation
	that can be helpful for use with svelte-konva:
</p>

<ul>
	<li>
		<a href="https://konvajs.org/docs/index.html" target="_blank" rel="noreferrer"
			>Konva Tutorials</a
		>
	</li>
	<li>
		<a href="https://konvajs.org/api/Konva.html" target="_blank" rel="noreferrer">Konva API docs</a>
	</li>
</ul>

<h2>Why use svelte-konva</h2>
<p>
	Konva can be easily used as a standalone library in Svelte without the need for any wrappers.
	Before choosing svelte-konva you might want to consider whether svelte-konva is actually
	supporting your use-case or if you're better off using Konva as standalone library.
</p>

<p>
	The main goal of svelte-konva is to reduce redundant code that is required to instantiate any
	Konva node and to make Konva more accessible for the use in Svelte. If your project is complex,
	has strict performance requirements or requires unconventional custom solutions, svelte-konva is
	not recommended. In such a case you should use Konva as a standalone library. Consider the example
	below where Konva is used standalone to create a rectangle and a cricle on a canvas:
</p>

<CodeSnippet title="Konva Standalone" code={KonvaStandalone} />

<p>The same code can be expressed using svelte-konva components:</p>

<CodeSnippet title="svelte-konva equivalent" code={SvelteKonvaStandalone} />

<p>
	As can be seen from the code snippets, standalone Konva uses a programmatic approach to create
	nodes while in svelte-konva the nodes are built using components. The following list illustrates
	some of the advantages and disadvantages of svelte-konva compared to using Konva standalone in
	your Svelte project:
</p>

<strong>Advantages</strong>
<ul>
	<li>
		No need to programmatically create Konva nodes and manage their lifecycle (creation and
		destruction)
	</li>
	<li>No need to manually attach nodes (Circle, Rect, ...) to a container (Stage, Layer, ...)</li>
	<li>
		Events can be easily listened to using the Svelte on-syntax without the need to manually
		register them
	</li>
	<li>
		Using the bind syntax the configuration of a Konva node can be automatically updated on drag and
		transform of the node
	</li>
</ul>

<strong>Disadvantages</strong>
<ul>
	<li>
		Small additional performance overhead as each native Konva node is wrapped inside a Svelte
		component
	</li>
	<li>Might not be suited for every project, especially large ones with complex requirements</li>
</ul>

<h2>Issues/Questions</h2>
In case you encounter any difficulties while using svelte-konva do not hesitate to
<a href="https://github.com/TeyKey1/svelte-konva/issues">open an issue</a>.
