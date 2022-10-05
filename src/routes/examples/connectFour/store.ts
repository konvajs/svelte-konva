/**
 * Stores used for the connect four game
 */
import { writable } from 'svelte/store';
import type { Player } from './types';
import cloneDeep from 'lodash.clonedeep';

export const gameScale = writable(1);

// Game state used to keep track where a token/stone is already present
export type GameState = Array<Array<Player | null>>;

const EMPTY_GAME_STATE: GameState = [
	[null, null, null, null, null, null],
	[null, null, null, null, null, null],
	[null, null, null, null, null, null],
	[null, null, null, null, null, null],
	[null, null, null, null, null, null],
	[null, null, null, null, null, null],
	[null, null, null, null, null, null]
];

// Empty game state array needs to be cloned to avoid overwriting it. Otherwise js memory management fools us
export function getEmptyGameState(): GameState {
	return cloneDeep(EMPTY_GAME_STATE);
}

export const gameState = writable<GameState>(getEmptyGameState());
