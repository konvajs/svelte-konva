import type Konva from 'konva';

/**
 * Shared props type used on all svelte-konva components
 */
export type Props<Config> = {
	config: Config;
	staticConfig?: boolean;
};

/**
 * Special props extension for svelte-konva Stage (Forwards rest props to canvas div container)
 */
export interface StageProps extends Props<Konva.ContainerConfig> {
	readonly handle?: null | Konva.Stage;
	[key: string]: any;
}
