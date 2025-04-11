/**
 * In order to be able to detect the parent component of a svelte-konva component the svelte context is used.
 * This functionality is required to automatically add the child components to a Layer/Stage etc.
 *
 * As the svelte context access is not limited to the first child of a component's context but all of its childs regardless of nesting level
 * a trick is used to ensure that each svelte-konva child component only has access to its parent and not any grandparent components.
 * Each time the setContainerContext() function is called the context of the parent container is nulled, thus ensuring that the child components
 * do not have access to any grandparent context.
 */

import type { Stage } from 'konva/lib/Stage';
import type { Layer } from 'konva/lib/Layer';
import type { Group } from 'konva/lib/Group';
import type { Label } from 'konva/lib/shapes/Label';
import { getContext, setContext } from 'svelte';

/** Keys used for each konva container element in the svelte context */
export const CONTAINER_COMPONENT_KEYS = [
	'svelte-konva-stage',
	'svelte-konva-layer',
	'svelte-konva-group',
	'svelte-konva-label'
];

/** Konva container kind */
export enum Container {
	Stage = 0,
	Layer = 1,
	Group = 2,
	Label = 3
}

type KonvaContainer = Stage | Layer | Group | Label;
export type KonvaParent = Layer | Group | Label;

export const CONTAINER_ERROR =
	'svelte-konva: Component does not have any parent container. Please make sure that the component is wrapped inside a Layer or Group.';
export const LAYER_ERROR = 'svelte-konva: A Layer needs to have a Stage as parent.';

/**
 * Sets the svelte context of the calling module to the provided konva container type
 *
 * **Caution:** This function can only be successfully called in the initialization part of a svelte component
 *
 * @param kind The current konva container kind
 * @param value The writable store associated with the container
 */
export function setContainerContext(kind: Container, value: null | KonvaContainer) {
	// Set all parent context to null
	CONTAINER_COMPONENT_KEYS.forEach((key) => {
		setContext(key, null);
	});

	setContext(CONTAINER_COMPONENT_KEYS[kind], value);
}

/**
 * Gets the Konva parent container (Layer, Group, Label) of a svelte-konva component
 *
 * @returns Konva parent container
 * @throws if component does not have a Konva parent (wrong usage of library)
 */
export function getParentContainer(): KonvaParent {
	for (let i = 1; i < 4; i++) {
		// Loop all containers excluding stage
		const parent = getContext<null | KonvaParent>(CONTAINER_COMPONENT_KEYS[i]);

		if (parent) {
			return parent;
		}
	}

	throw new Error(CONTAINER_ERROR);
}

/**
 * Gets the Konva parent Stage of a svelte-konva layer component
 *
 * @returns Konva parent container
 * @throws if component does not have a Konva parent or it is not a stage (wrong usage of library)
 */
export function getParentStage(): Stage {
	const parent = getContext<null | Stage>(CONTAINER_COMPONENT_KEYS[Container.Stage]);

	if (parent) {
		return parent;
	}

	throw new Error(LAYER_ERROR);
}
