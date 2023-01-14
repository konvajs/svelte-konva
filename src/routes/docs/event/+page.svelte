<script lang="ts">
	import Code from '../../Code.svelte';
	import Event from './Event.svelte';
	import eventCode from './Event.svelte?raw';
	import Warn from '../../Warn.svelte';
</script>

<h2>Events</h2>

<p>
	You can listen to all konva events using the Svelte on:event syntax. There is no need to manually
	register event listeners yourself. For a list of all available konva events please consult the <a
		href="https://konvajs.org/docs/events/Binding_Events.html"
		target="_blank"
		rel="noreferrer">Konva docs</a
	>.
</p>

<h3>Event Propagation</h3>
<p>
	Konva events bubble up by default. This behavior can be observed by double clicking the black
	rectangle. This means that the initial event is observed on the rectangle, then passed to the
	layer and stage which contain the rectangle.
</p>

<p>
	If such behavior is not desired you can call the <code>preventDefault()</code> method on the received
	event object to cancel the bubbling. This is done on the event handler for the red circle. If you double
	click the red circle you can observe that the event is stopped and not propagated to the layer or stage.
</p>

<Warn>
	<p>
		In vanilla Konva one would do this by setting the <code>cancelBubble</code> property of the
		event to true. Be aware that this does not work in svelte-konva and needs to be done by calling
		<code>preventDefault()</code>
	</p>
</Warn>

<p />

<Event />

<Code code={eventCode} />
