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
import type { Writable } from 'svelte/store';
/** Keys used for each konva container element in the svelte context */
export declare const CONTAINER_COMPONENT_KEYS: string[];
/** Konva container kind */
export declare enum Container {
    Stage = 0,
    Layer = 1,
    Group = 2,
    Label = 3
}
type KonvaContainer = Stage | Layer | Group | Label;
export type KonvaParent = Layer | Group | Label;
export declare const CONTAINER_ERROR = "svelte-konva: Component does not have any parent container. Please make sure that the component is wrapped inside a Layer or Group.";
export declare const LAYER_ERROR = "svelte-konva: A Layer needs to have a Stage as parent.";
/**
 * Sets the svelte context of the calling module to the provided konva container type
 *
 * **Caution:** This function can only be successfully called in the initialization part of a svelte component
 *
 * @param kind The current konva container kind
 * @param value The writable store associated with the container
 */
export declare function setContainerContext(kind: Container, value: Writable<null | KonvaContainer>): void;
export declare function getParentContainer(): Writable<null | KonvaParent>;
export declare function getParentStage(): Writable<null | Stage>;
export {};
