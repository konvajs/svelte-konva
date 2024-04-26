<script lang="ts">
	import GameGrid from './GameGrid.svelte';
	import { Player, type TokenPos } from './types';
	import Token from './Token.svelte';
	import { gameState, getEmptyGameState } from './store';
	import type Konva from 'konva';
	import { GAME_GRID_COL_POSITIONS, GAME_GRID_ROW_POSITIONS } from './constants';
	import Circle from 'svelte-konva/Circle.svelte';
	import { onDestroy } from 'svelte';

	let activePlayer = $state(Player.Red);
	let tokens: Array<Player> = $state([Player.Red]);

	/**
	 * Handle the end of a single player move
	 */
	function handleMoveEnd(e: CustomEvent<TokenPos>) {
		// Check winning condition
		const won = hasWon(e.detail);
		if (won) {
			handleWin(won);
			return;
		}

		// Check if the game is a draw
		if (tokens.length >= 42) {
			handleDraw();
			return;
		}

		// Change active player
		if (activePlayer === Player.Red) {
			activePlayer = Player.Blue;
		} else {
			activePlayer = Player.Red;
		}

		tokens.push(activePlayer);
		tokens = tokens;
	}

	/**
	 * Checks the winning condition and returns true if a player has won
	 */
	function hasWon(lastTokenPos: TokenPos): null | Array<TokenPos> {
		// Winning condition only needs to be checked for the player who placed the last token
		const potentialWinner = $gameState[lastTokenPos.colPos][lastTokenPos.rowPos]!;

		let result = checkHorizontal(lastTokenPos, potentialWinner);

		if (result) {
			return result;
		}

		result = checkVertical(lastTokenPos, potentialWinner);

		if (result) {
			return result;
		}

		result = checkDiagonal(lastTokenPos, potentialWinner);

		if (result) {
			return result;
		}

		return null;
	}

	/**
	 * Check vertically for the winning condition
	 */
	function checkVertical(lastTokenPos: TokenPos, potentialWinner: Player): null | Array<TokenPos> {
		const colPos = lastTokenPos.colPos;

		// Vertically we only need to check downwards and not upwards as the tokens flow down to the bottommost position
		let winningTokens: Array<TokenPos> = [lastTokenPos];
		let cursor = lastTokenPos.rowPos + 1;
		while (winningTokens.length !== 4 && cursor < 6) {
			if ($gameState[colPos][cursor] !== potentialWinner) {
				break;
			}

			winningTokens.push({ colPos, rowPos: cursor });
			cursor++;
		}

		if (winningTokens.length === 4) {
			return winningTokens;
		}

		return null;
	}

	/**
	 * Check horizontally for the winning condition
	 */
	function checkHorizontal(
		lastTokenPos: TokenPos,
		potentialWinner: Player
	): null | Array<TokenPos> {
		const rowPos = lastTokenPos.rowPos;

		let winningTokens: Array<TokenPos> = [lastTokenPos];
		let cursor = lastTokenPos.colPos + 1;
		while (winningTokens.length !== 4 && cursor < 7) {
			if ($gameState[cursor][rowPos] !== potentialWinner) {
				break;
			}

			winningTokens.push({ colPos: cursor, rowPos });
			cursor++;
		}

		cursor = lastTokenPos.colPos - 1;
		while (winningTokens.length !== 4 && cursor >= 0) {
			if ($gameState[cursor][rowPos] !== potentialWinner) {
				break;
			}

			winningTokens.push({ colPos: cursor, rowPos });
			cursor--;
		}

		if (winningTokens.length === 4) {
			return winningTokens;
		}

		return null;
	}

	/**
	 * Check diagonally for the winning condition
	 */
	function checkDiagonal(lastTokenPos: TokenPos, potentialWinner: Player): null | Array<TokenPos> {
		// check southeast
		let winningTokens: Array<TokenPos> = [lastTokenPos];
		let colCursor = lastTokenPos.colPos + 1;
		let rowCursor = lastTokenPos.rowPos + 1;
		while (winningTokens.length !== 4 && colCursor < 7 && rowCursor < 6) {
			if ($gameState[colCursor][rowCursor] !== potentialWinner) {
				break;
			}

			winningTokens.push({ colPos: colCursor, rowPos: rowCursor });
			colCursor++;
			rowCursor++;
		}

		// check northwest
		colCursor = lastTokenPos.colPos - 1;
		rowCursor = lastTokenPos.rowPos - 1;
		while (winningTokens.length !== 4 && colCursor >= 0 && rowCursor >= 0) {
			if ($gameState[colCursor][rowCursor] !== potentialWinner) {
				break;
			}

			winningTokens.push({ colPos: colCursor, rowPos: rowCursor });
			colCursor--;
			rowCursor--;
		}

		if (winningTokens.length === 4) {
			return winningTokens;
		}

		// check southwest
		winningTokens = [lastTokenPos];
		colCursor = lastTokenPos.colPos - 1;
		rowCursor = lastTokenPos.rowPos + 1;
		while (winningTokens.length !== 4 && colCursor >= 0 && rowCursor < 6) {
			if ($gameState[colCursor][rowCursor] !== potentialWinner) {
				break;
			}

			winningTokens.push({ colPos: colCursor, rowPos: rowCursor });
			colCursor--;
			rowCursor++;
		}

		// check northeast
		colCursor = lastTokenPos.colPos + 1;
		rowCursor = lastTokenPos.rowPos - 1;
		while (winningTokens.length !== 4 && colCursor < 7 && rowCursor >= 0) {
			if ($gameState[colCursor][rowCursor] !== potentialWinner) {
				break;
			}

			winningTokens.push({ colPos: colCursor, rowPos: rowCursor });
			colCursor++;
			rowCursor--;
		}

		if (winningTokens.length === 4) {
			return winningTokens;
		}

		return null;
	}

	let isDraw = $state(false);

	function handleDraw() {
		isDraw = true;
	}

	let isWon = $state(false);

	let winningTokenPositions = $state<Array<Konva.Vector2d>>([]);

	function handleWin(winningTokens: Array<TokenPos>) {
		winningTokens.forEach((tokenPos) => {
			winningTokenPositions.push({
				x: GAME_GRID_COL_POSITIONS[tokenPos.colPos],
				y: GAME_GRID_ROW_POSITIONS[tokenPos.rowPos]
			});
		});

		isWon = true;
	}

	// Flag used to trigger Token reinstantiation
	let reset = $state(false);

	function resetGame() {
		isWon = false;
		isDraw = false;
		winningTokenPositions = [];

		gameState.update((state) => {
			state = getEmptyGameState();
			return state;
		});

		tokens = [activePlayer];

		// Flip reset flag to force token component reinstantiation
		reset = !reset;
	}

	onDestroy(() => {
		// reset the game along with its state, otherwise the game contains old state once the component gets mounted again
		resetGame();
	});
</script>

<div class="flex justify-center">
	<button class="btn btn-primary" onclick={resetGame}>Restart</button>
</div>

<div class="flex justify-center mt-1">
	{#if isWon}
		<h1>Player {activePlayer} won!</h1>
	{/if}

	{#if isDraw}
		<h1>Game ended in a draw!</h1>
	{/if}
</div>

<GameGrid>
	<!-- The key block is required to force reinstantiation of all remaining tokens in memory for a clean game reset -->
	{#key reset}
		{#each tokens as token}
			<Token player={token} on:dropped={handleMoveEnd} />
		{/each}
	{/key}

	{#if isWon}
		{#each winningTokenPositions as pos}
			<Circle
				config={{
					x: pos.x,
					y: pos.y,
					fill: 'yellow',
					radius: 20
				}}
			/>
		{/each}
	{/if}
</GameGrid>
