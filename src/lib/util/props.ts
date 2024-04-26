import type { Snippet } from 'svelte';
import { type KonvaEventHooks } from '$lib/util/events';

/**
 * Shared props type used on all svelte-konva components
 */
export type Props<Node, Config> = {
	config: Config;
	staticConfig?: boolean;
	handle?: Node;
} & KonvaEventHooks;

/**
 * Same as Props but with optional Config
 */
export type PropsOptionalConfig<Node, Config> = {
	config?: Config;
	staticConfig?: boolean;
	handle?: Node;
} & KonvaEventHooks;


/**
 * Props extension for konva container types which can hold more konva nodes
 */
export type PropsContainer = {
	children?: Snippet;
}

/**
 * Special props extension for svelte-konva Stage (Forwards rest props to canvas div container)
 */
export type PropsStage = {
	[key: string]: any;
}
