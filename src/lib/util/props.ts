import type { Snippet } from 'svelte';
import { type KonvaEventHooks } from '$lib/util/events';

/**
 * Shared props type used on all svelte-konva components
 */
export type Props<Config> = {
	staticConfig?: boolean;
} & KonvaEventHooks &
	Omit<Config, 'rotationDeg'>; // rotationDeg is deprecated by Konva

/**
 * Props extension for konva container types which can hold more konva nodes
 */
export type PropsContainer = {
	children?: Snippet;
};

/**
 * Special props extension for svelte-konva Stage (Forwards rest props to canvas div container)
 */
export type PropsStage = {
	divWrapperProps: {
		[key: string]: any; // Everything in this object is forwarded to the wrapper div
	};
};
