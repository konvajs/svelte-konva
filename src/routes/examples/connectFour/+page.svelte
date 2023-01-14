<script lang="ts">
	import Game from './Game.svelte';
</script>

<h2>Connect four</h2>

<p>
	This is an implementation of the game "connect four" to show some of the capabilities of konva and
	svelte-konva. The goal of the game is to align four of your stones/tokens either horizontally,
	vertically or diagonally before your opponent manages to do so.
</p>

<p>
	To play simply drag the token/stone over one of the game grid columns to drop it into the game
	grid.
</p>

<Game />

<h3>Source Code:</h3>
The source code can be found in the
<a
	href="https://github.com/TeyKey1/svelte-konva/tree/master/src/routes/examples/connectFour"
	target="_blank"
	rel="noreferrer">svelte-konva repository</a
>.
