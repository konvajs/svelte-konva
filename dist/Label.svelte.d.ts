import { Label as KonvaLabel } from 'konva/lib/shapes/Label';
import { type PropsContainer } from './util/props';
/**
 * The Label component needs to be placed either inside a svelte-konva Layer or Group component.
 *
 * To work as intended it needs to contain a Tag component as well as a Text component in the order shown below.
 *
 * ### Usage:
 * ```tsx
 * <Label x={100} y={100} opacity={0.8}>
 * <Tag fill="black" pointerDirection="down" pointerWidth={10} pointerHeight={10} lineJoin="round" />
 * <Text text="some label text" fontSize={18} padding={10} fill="white" />
 * </Label>
 * ```
 *
 * ### Static config:
 * By default svelte-konva will automatically update all changed props on `dragend` and `transformend` events to match the prop values (position, rotation, scale, ...) with the internal Konva state.
 * If you bind those props they will be updated automatically, otherwise no update of the changed values happens.
 * In cases this is not needed (eg. the respective values are not bound) or not beneficial you can disable it by passing the `staticConfig = true` prop to the component.
 * It is recommended to only pass `staticConfig = true` if you indeed run into performance problems connected to dragging and transforming of nodes.
 *
 * Further information: [Konva API docs](https://konvajs.org/api/Konva.Label.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
 */
declare const Label: import("svelte").Component<{
    staticConfig?: boolean;
} & import("./util/events").KonvaEventHooks & {
    [x: string]: any;
    clearBeforeDraw?: boolean | undefined;
    clipFunc?: ((ctx: import("konva/lib/Context").SceneContext) => import("konva/lib/Container").ClipFuncOutput) | undefined;
    clipX?: number | undefined;
    clipY?: number | undefined;
    clipWidth?: number | undefined;
    clipHeight?: number | undefined;
    x?: number | undefined;
    y?: number | undefined;
    width?: number | undefined;
    height?: number | undefined;
    visible?: boolean | undefined;
    listening?: boolean | undefined;
    id?: string | undefined;
    name?: string | undefined;
    opacity?: number | undefined;
    scale?: import("konva/lib/types").Vector2d | undefined;
    scaleX?: number | undefined;
    skewX?: number | undefined;
    skewY?: number | undefined;
    scaleY?: number | undefined;
    rotation?: number | undefined;
    offset?: import("konva/lib/types").Vector2d | undefined;
    offsetX?: number | undefined;
    offsetY?: number | undefined;
    draggable?: boolean | undefined;
    dragDistance?: number | undefined;
    dragBoundFunc?: ((this: import("konva/lib/Node").Node, pos: import("konva/lib/types").Vector2d) => import("konva/lib/types").Vector2d) | undefined;
    preventDefault?: boolean | undefined;
    globalCompositeOperation?: ("" | "copy" | "source-over" | "source-in" | "source-out" | "source-atop" | "destination-over" | "destination-in" | "destination-out" | "destination-atop" | "lighter" | "xor" | "multiply" | "screen" | "overlay" | "darken" | "lighten" | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference" | "exclusion" | "hue" | "saturation" | "color" | "luminosity") | undefined;
    filters?: Array<import("konva/lib/Node").Filter> | undefined;
} & PropsContainer, {
    handle: KonvaLabel;
}, "x" | "y" | "scale" | "scaleX" | "skewX" | "skewY" | "scaleY" | "rotation">;
export default Label;
