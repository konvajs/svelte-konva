/**
 * In order to be able to detect the parent component of a svelte-konva component the svelte context is used.
 * This functionality is required to automatically add the child components to a Layer/Stage etc.
 *
 * As the svelte context access is not limited to the first child of a component's context but all of its childs regardless of nesting level
 * a trick is used to ensure that each svelte-konva child component only has access to its parent and not any grandparent components.
 * Each time the setContainerContext() function is called the context of the parent container is nulled, thus ensuring that the child components
 * do not have access to any grandparent context.
 */
import { getContext, setContext } from 'svelte';
/** Keys used for each konva container element in the svelte context */
export const CONTAINER_COMPONENT_KEYS = [
    'svelte-konva-stage',
    'svelte-konva-layer',
    'svelte-konva-group',
    'svelte-konva-label'
];
/** Konva container kind */
export var Container;
(function (Container) {
    Container[Container["Stage"] = 0] = "Stage";
    Container[Container["Layer"] = 1] = "Layer";
    Container[Container["Group"] = 2] = "Group";
    Container[Container["Label"] = 3] = "Label";
})(Container || (Container = {}));
export const CONTAINER_ERROR = 'svelte-konva: Component does not have any parent container. Please make sure that the component is wrapped inside a Layer or Group.';
export const LAYER_ERROR = 'svelte-konva: A Layer needs to have a Stage as parent.';
/**
 * Sets the svelte context of the calling module to the provided konva container type
 *
 * **Caution:** This function can only be successfully called in the initialization part of a svelte component
 *
 * @param kind The current konva container kind
 * @param value The writable store associated with the container
 */
export function setContainerContext(kind, value) {
    // Set all parent context to null
    CONTAINER_COMPONENT_KEYS.forEach((key) => {
        setContext(key, null);
    });
    setContext(CONTAINER_COMPONENT_KEYS[kind], value);
}
export function getParentContainer() {
    for (let i = 1; i < 4; i++) {
        const parent = getContext(CONTAINER_COMPONENT_KEYS[i]);
        if (parent) {
            return parent;
        }
    }
    throw new Error(CONTAINER_ERROR);
}
export function getParentStage() {
    const parent = getContext(CONTAINER_COMPONENT_KEYS[Container.Stage]);
    if (parent) {
        return parent;
    }
    throw new Error(LAYER_ERROR);
}
