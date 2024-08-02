/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Snippet } from 'svelte';
import { type KonvaEventHooks } from '$lib/util/events';
import type Konva from 'konva';

type MappedOmit<T, K extends keyof T> = { [P in keyof T as P extends K ? never : P]: T[P] };

/**
 * Shared props type used on all svelte-konva components
 */
export type Props<Config extends Konva.NodeConfig> = {
	staticConfig?: boolean;
} & KonvaEventHooks &
	MappedOmit<Config, 'rotationDeg'>; // rotationDeg is deprecated by Konva

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
	divWrapperProps?: {
		[key: string]: any; // Everything in this object is forwarded to the wrapper div
	};
};
