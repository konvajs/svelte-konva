import type Konva from 'konva';
import type { Bindable, Snippet } from 'svelte';

/**
 * Shared props type used on all svelte-konva components
 */
export type Props<Config> = {
	config: Config;
	staticConfig?: boolean;
};

/**
 * Props extension for konva container types which can hold more konva nodes
 */
export interface PropsContainer<Config> extends Props<Config> {
	children?: Snippet;
}

/**
 * Special props extension for svelte-konva Stage (Forwards rest props to canvas div container)
 */
export interface StageProps extends PropsContainer<Konva.ContainerConfig> {
	readonly handle?: null | Konva.Stage;
	[key: string]: any;
}
