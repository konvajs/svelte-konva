<script lang="ts">
	/**
	 * token/stone used in the game
	 */
	import Circle from 'svelte-konva/Circle.svelte';
	import type { KonvaDragTransformEvent } from 'svelte-konva';
	import Konva from 'konva';
	import {
		GAME_BASE_SIZE,
		GAME_GRID_COL_POSITIONS,
		GAME_GRID_ROW_POSITIONS,
		TOKEN_RADIUS
	} from './constants';
	import { Player } from './types';
	import { gameScale, gameState } from './store';
	import { createEventDispatcher } from 'svelte';

	type Props = {
		player: Player;
	};

	let { player }: Props = $props();

	let token = $state<Konva.Circle>();
	let dispatch = createEventDispatcher();

	const TOKEN_RED_INITIAL_POS = { x: 80, y: 80 };
	const TOKEN_BLUE_INITIAL_POS = { x: GAME_BASE_SIZE - 80, y: 80 };

	const TOKEN_MIN_DRAG_X = 0;
	const TOKEN_MAX_DRAG_X = GAME_BASE_SIZE;
	const TOKEN_MIN_DRAG_Y = 0;
	const TOKEN_MAX_DRAG_Y = 200;

	// The min y-coordinate value of a token to be eligible to be dropped into the game grid
	const TOKEN_DROP_THRESHOLD_Y = 100;
	// The max allowed x-coordinate deviation from the center of a connect four grid column to be eligible to be dropped into said column
	const TOKEN_DROP_MAX_DEVIATION_X = 40;

	const initialTokenPos = getInitialTokenPos();

	let config = $state<Konva.CircleConfig>({
		x: initialTokenPos.x,
		y: initialTokenPos.y,
		radius: TOKEN_RADIUS,
		fill: player,
		draggable: true,
		dragBoundFunc: limitTokenDrag
	});

	/**
	 * Get the initial position of the token once it enters the game
	 */
	function getInitialTokenPos(): Konva.Vector2d {
		switch (player) {
			case Player.Blue:
				return { x: TOKEN_BLUE_INITIAL_POS.x, y: TOKEN_BLUE_INITIAL_POS.y };
			case Player.Red:
				return { x: TOKEN_RED_INITIAL_POS.x, y: TOKEN_RED_INITIAL_POS.y };
			default:
				throw new Error('Undefined player configuration. Game can only have two players');
		}
	}

	/**
	 * Sets the drag boundaries of a token to prevent it from being dragged onto the game grid.
	 * The tokens are only allowed to be moved above the game grid before being dropped into the grid.
	 */
	function limitTokenDrag(pos: Konva.Vector2d): Konva.Vector2d {
		const scale = $gameScale;

		// As the game can be scaled according to its parent container we need to calculate the real boundaries based on the base size and the current scale of the game
		const realMaxDragX = TOKEN_MAX_DRAG_X * scale;
		const realMinDragX = TOKEN_MIN_DRAG_X * scale;
		const realMaxDragY = TOKEN_MAX_DRAG_Y * scale;
		const realMinDragY = TOKEN_MIN_DRAG_Y * scale;

		if (pos.x < realMinDragX) {
			pos.x = realMinDragX;
		} else if (pos.x > realMaxDragX) {
			pos.x = realMaxDragX;
		}

		if (pos.y < realMinDragY) {
			pos.y = realMinDragY;
		} else if (pos.y > realMaxDragY) {
			pos.y = realMaxDragY;
		}

		return pos;
	}

	// On dragend we need to check if the token/stone has been moved into a position where it can be dropped into the game grid
	function handleDragEnd(e: KonvaDragTransformEvent) {
		// stop propagation as the event handling is done in this component
		e.stopPropagation();

		// as the circle config is bound we already know the current position of the circle and do not need to extract it from the event manually
		if (config.y! < TOKEN_DROP_THRESHOLD_Y) {
			return;
		}

		for (let [colPos, xPos] of GAME_GRID_COL_POSITIONS.entries()) {
			if (
				xPos + TOKEN_DROP_MAX_DEVIATION_X >= config.x! &&
				xPos - TOKEN_DROP_MAX_DEVIATION_X <= config.x!
			) {
				// Token is in a correct position to be dropped
				// Check if column at the matching position has free space
				if (!$gameState[colPos].includes(null)) {
					break;
				}

				// Disable token dragging and align with column
				config.draggable = false;
				config.x = GAME_GRID_COL_POSITIONS[colPos];

				dropToken(colPos);
				break;
			}
		}
	}

	/**
	 * Drop the token into the game grid
	 */
	function dropToken(colPos: number) {
		// Determine the row position of where it will land
		let rowPos: number;
		for (let i = 5; i >= 0; i--) {
			if (!$gameState[colPos][i]) {
				rowPos = i;
				break;
			}
		}

		// insert the token into the game state
		gameState.update((state) => {
			state[colPos][rowPos] = player;
			return state;
		});

		// Create a tween to animate the drop
		const tween = new Konva.Tween({
			node: token!,
			duration: 1,
			y: GAME_GRID_ROW_POSITIONS[rowPos!],
			easing: Konva.Easings.BounceEaseOut,
			onFinish: () => {
				// Immediately destroy tween as it is not used anymore
				tween.destroy();
			}
		});

		tween.play();

		// emit event to parent to signal the end of the move
		dispatch('dropped', { colPos, rowPos: rowPos! });
	}
</script>

<Circle bind:config on:dragend={handleDragEnd} bind:handle={token} />
