<script lang="ts">
	import CodeSnippet from '../../CodeSnippet.svelte';

	// Code snippets
	import KonvaLayeringExample from '../../code-snippets/layering/KonvaLayeringExample.svelte';
	import KonvaLayeringExampleRaw from '../../code-snippets/layering/KonvaLayeringExample.svelte?raw';
	import ComponentBased from './ComponentBased.svelte';
	import ComponentBasedCode from './ComponentBased.svelte?raw';
	import DynamicComponentBased from './DynamicComponentBased.svelte';
	import DynamicComponentBasedCode from './DynamicComponentBased.svelte?raw';
	import KonvaBased from './KonvaBased.svelte';
	import KonvaBasedCode from './KonvaBased.svelte?raw';
	import EachBlockBased from './EachBlockBased.svelte';
	import EachBlockBasedCode from './EachBlockBased.svelte?raw';

	// Assets
	import KonvaTree from './konva_tree.png';
	import EachBlockUnkeyedDataFlow from './svelte_unkeyed_each_data_flow.png';
</script>

<h2>Layering</h2>

<p>
	Layering of shapes, groups and layers is perhaps the most complex part of svelte-konva with a
	variety of pitfalls. The following page describes some approaches to layering in svelte-konva and
	their implications/pitfalls. While svelte-konva aims to provide a simple, easy to understand and
	predictable interface for developers the layering is rather complex compared to other
	functionalities. This is partly caused by the architecture of Konva and Svelte itself which lead
	to some implications and restrictions in svelte-konva.
</p>

<h3>Layering in Konva</h3>
<p>
	In order to understand the following explanations it is important to understand how Konva itself
	handles layering. The Konva docs explain this <a
		href="https://konvajs.org/docs/groups_and_layers/zIndex.html"
		target="_blank">here</a
	>.
</p>

<p>
	Konva draws nodes strictly in the order they are defined in the tree data structure. This means
	that the node which was created last is shown at the top of the canvas while the first created
	element is shown at the bottom. The following example shows how Konva handles the layering once
	the nodes have been setup:
</p>

<div class="flex items-center justify-center m-4">
	<KonvaLayeringExample />
</div>

<CodeSnippet title="Layering example in standalone Konva" code={KonvaLayeringExampleRaw} />

<p>
	The important bit in this example is where the shapes are added to the containers (Stage, Layer,
	Group) and the containers are attached to each other inside the <code>onMount</code> callback. The
	black triangle is the bottommost shape and is attached to the <code>layer</code> which is added to
	the stage before <code>otherLayer</code> is added. Thus the entire content of
	<code>otherLayer</code> is drawn above the black triangle. The content of <code>otherLayer</code> is
	a group containing a circle and a rectangle as well as a yellow ring. In this case the yellow ring
	is added to the layer after the group was added which results in the ring being drawn above the content
	of the group, even if the rectangle has been added to the group after the ring has been added to the
	layer. This is due to Konva drawing the contents of a container based on the position of the container
	(in our case the group which was added to the layer before the yellow ring).
</p>

<p>The node tree of this example would look as follows:</p>

<div class="flex items-center justify-center">
	<img src={KonvaTree} alt="konva tree" />
</div>

<p>
	With the knowledge of how Konva handles layering we can dive into the various ways of layering
	shapes in svelte-konva. Keep in mind that you can combine the outlined approaches as you see fit
	to achieve your goal.
</p>

<h3>Layering based on component order</h3>
<p>
	In some applications it is not required to dynamically add new components at various layering
	depths but only at the top of the canvas. Or it is not required to dynamically add new components
	at all. In such cases layering can be easily done based on the order of the components inside the
	stage component. The bottommost components will be shown on top of the canvas.
</p>

<strong>Advantages</strong>
<ul>
	<li>Very simple to use</li>
</ul>

<strong>Disadvantages</strong>
<ul>
	<li>
		Does not support dynamic layering in any way. Dynamically added shapes or containers (by using
		an each block for example) are always drawn on top of the canvas no matter the position in the
		svelte layout
	</li>
</ul>

<ComponentBased />

<CodeSnippet title="Source" code={ComponentBasedCode} />

<h3>Dynamic Layering based on component order</h3>
<p>
	Layering based on component order can be made dynamic by wrapping the content or parts of the
	stage inside a Svelte key block. Using a flag variable, which is modified each time a dynamic
	change is happening, the components inside the key block get entirely rerendered according to
	their current position in the layout.
</p>

<strong>Advantages</strong>
<ul>
	<li>
		Relatively simple way to achieve dynamic layering while still relying on the component order in
		the layout
	</li>
</ul>

<strong>Disadvantages</strong>
<ul>
	<li>
		Has a performance impact as each modification of the Svelte key results in the destruction and
		reinstantiation of all contained components, including the underlying Konva objects. This can be
		acceptable for smaller applications but might cause problems in larger ones.
	</li>
</ul>

<DynamicComponentBased />

<CodeSnippet title="Source" code={DynamicComponentBasedCode} />

<h3>Dynamic Layering using native Konva methods</h3>
<p>
	Using the <a href="https://konvajs.org/docs/groups_and_layers/Layering.html" target="_blank"
		>Konva methods</a
	> for layering shapes and containers you can achieve virtually any functionality.
</p>

<strong>Advantages</strong>
<ul>
	<li>The native way of layering. It is therefore one of the most performant solutions</li>
	<li>Very flexible. You can achieve almost anything with this approach</li>
</ul>

<strong>Disadvantages</strong>
<ul>
	<li>Can become quite complex and requires a lot of code</li>
</ul>

<KonvaBased />

<CodeSnippet title="Source" code={KonvaBasedCode} />

<h3>Dynamic Layering inside Svelte each blocks</h3>
<p>
	Dynamic layering using Svelte each blocks can only be done when it iterates over a single
	component type. Additionally this variant comes with a lot of pitfalls you need to be aware of.
	For those reasons it is recommended to consider other approaches to layering before using this
	one. This approach is still explained in the docs to make people aware of the pitfalls they might
	encounter by trying to use each blocks for layering.
</p>

<strong>Advantages</strong>
<ul>
	<li>Layering can be done by manipulating the position of data inside an array</li>
	<li>
		Is performant, as existing components do not get reinstantiated if the data changes, only the
		data is modified/moved
	</li>
</ul>

<strong>Disadvantages</strong>
<ul>
	<li>Has a lot of pitfalls</li>
	<li>
		Only works when iterating over a single component type. Any each blocks using svelte:component
		for dynamic components will not work
	</li>
	<li>
		The layering does only work for components that are generated inside the each block. Everything
		else is not affected and acts according to the Konva layering system
	</li>
</ul>

<p>
	In order to better understand why this solution has a lot of pitfalls, we need to have a look at
	how an unkeyed svelte each-block operates. If a new element is added to the iterated array the
	each block creates new instances of its contained components and supplies the newest instance with
	the topmost element in the iterated array. In svelte-konva context this means that the element in
	the topmost position of the array is assigned to the newest svelte-konva component instance which
	in turn means that it is displayed at the top of the canvas.
</p>

<p>
	What happens if the order of elements in the array is changed? In the case of an unkeyed
	each-block only the data is now newly distributed among the existing component instances. In the
	svelte-konva context this means that not the component instances themselves are reinstantiated to
	achieve the new component order on the canvas but only the data of those components.
</p>

<div class="flex items-center justify-center">
	<img src={EachBlockUnkeyedDataFlow} alt="svelte unkeyed each block dataflow" />
</div>

<p>
	As can be seen in the picture above is that the data flow enables the proper layering inside the
	each block. However, this only applies to the content inside the block and not any other
	components. One of the pitfalls is to key such an each block. This will lead to an incorrect
	layering order on the canvas once the iterated data order is changing as the data is now not
	flowing between the instantiated components but is tied to a single instantiated component (using
	the key) and will not get reassigned to another one during its lifetime.
</p>

<p>
	Another pitfall which can be encountered is when the iterated components are draggable or can be
	transformed in any way. In this case you need to ensure that the provided config object contains
	all the possible fields which can be modified by drag or transform operations. If this is not
	done, your components will contain invalid old data internally which does not fit to the assigned
	config data. This leads to unpredictable results on the canvas if the order of the itrated data is
	changed.
</p>

<EachBlockBased />

<CodeSnippet title="Source" code={EachBlockBasedCode} />
