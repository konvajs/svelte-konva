import { Transformer as KonvaTransformer, type TransformerConfig } from 'konva/lib/shapes/Transformer';
import { type Props } from './util/props';
/**
 * The Transformer component needs to be placed inside a svelte-konva Layer or Group component.
 *
 * In order to add shapes to the transformer you need to access the underlying Konva Transformer by binding the `handle` prop.
 * Then use the `nodes()` function to add any shapes to the Transformer.
 *
 * ### Usage:
 * ```tsx
 * <script>
 * let transformer;
 *
 * transformer.handle.nodes([someShape, otherShape]);
 * </script>
 *
 * <Transformer bind:this={transformer} />
 * ```
 *
 * ### Static config:
 * By default svelte-konva will automatically update all changed props on `dragend` and `transformend` events to match the prop values (position, rotation, scale, ...) with the internal Konva state.
 * If you bind those props they will be updated automatically, otherwise no update of the changed values happens.
 * In cases this is not needed (eg. the respective values are not bound) or not beneficial you can disable it by passing the `staticConfig = true` prop to the component.
 * It is recommended to only pass `staticConfig = true` if you indeed run into performance problems connected to dragging and transforming of nodes.
 *
 * Further information: [Konva API docs](https://konvajs.org/api/Konva.Transformer.html), [svelte-konva docs](https://konvajs.org/docs/svelte)
 */
declare const Transformer: import("svelte").Component<Props<TransformerConfig>, {
    handle: KonvaTransformer;
}, "x" | "y" | "scale" | "scaleX" | "skewX" | "skewY" | "scaleY" | "rotation">;
export default Transformer;
