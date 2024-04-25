import type Konva from 'konva';
import type { Bindable, Binding, Snippet } from 'svelte';
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
 * Props extension for konva container types which can hold more konva nodes
 */
export interface PropsContainer<Node, Config> extends Props<Node, Config> {
	children?: Snippet;
}

/**
 * Special props extension for svelte-konva Stage (Forwards rest props to canvas div container)
 */
export interface StageProps extends PropsContainer<Konva.Stage | null, Konva.ContainerConfig> {
	[key: string]: any;
}
