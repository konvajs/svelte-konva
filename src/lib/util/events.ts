/* eslint-disable @typescript-eslint/no-explicit-any */

import type Konva from 'konva';
import type { EventDispatcher } from 'svelte';

const KONVA_EVENTS = [
	'mouseover',
	'mouseout',
	'mouseenter',
	'mouseleave',
	'mousemove',
	'mousedown',
	'mouseup',
	'wheel',
	'click',
	'dblclick',
	'touchstart',
	'touchmove',
	'touchend',
	'tap',
	'dbltap',
	'pointerdown',
	'pointermove',
	'pointerup',
	'pointercancel',
	'pointerover',
	'pointerenter',
	'pointerout',
	'pointerleave',
	'pointerclick',
	'pointerdblclick',
	'dragstart',
	'dragmove',
	'dragend',
	'transformstart',
	'transform',
	'transformend'
];

export type KonvaMouseEvent = CustomEvent<Konva.KonvaEventObject<MouseEvent>>;
export type KonvaWheelEvent = CustomEvent<Konva.KonvaEventObject<WheelEvent>>;
export type KonvaTouchEvent = CustomEvent<Konva.KonvaEventObject<TouchEvent>>;
export type KonvaPointerEvent = CustomEvent<Konva.KonvaEventObject<PointerEvent>>;
export type KonvaDragTransformEvent = CustomEvent<
	Konva.KonvaEventObject<MouseEvent | PointerEvent | TouchEvent>
>;

export interface KonvaEvents {
	mouseover: KonvaMouseEvent;
	mouseout: KonvaMouseEvent;
	mouseenter: KonvaMouseEvent;
	mouseleave: KonvaMouseEvent;
	mousemove: KonvaMouseEvent;
	mousedown: KonvaMouseEvent;
	mouseup: KonvaMouseEvent;
	wheel: KonvaWheelEvent;
	click: KonvaMouseEvent;
	dblclick: KonvaMouseEvent;
	touchstart: KonvaTouchEvent;
	touchmove: KonvaTouchEvent;
	touchend: KonvaTouchEvent;
	tap: KonvaTouchEvent;
	dbltap: KonvaTouchEvent;
	pointerdown: KonvaPointerEvent;
	pointermove: KonvaPointerEvent;
	pointerup: KonvaPointerEvent;
	pointercancel: KonvaPointerEvent;
	pointerover: KonvaPointerEvent;
	pointerenter: KonvaPointerEvent;
	pointerout: KonvaPointerEvent;
	pointerleave: KonvaPointerEvent;
	pointerclick: KonvaPointerEvent;
	pointerdblclick: KonvaPointerEvent;
	dragstart: KonvaDragTransformEvent;
	dragmove: KonvaDragTransformEvent;
	dragend: KonvaDragTransformEvent;
	transformstart: KonvaDragTransformEvent;
	transform: KonvaDragTransformEvent;
	transformend: KonvaDragTransformEvent;
}

/**
 * Registers all possible Konva node events with the provided Svelte dispatcher
 *
 * @param dispatch
 * @param node
 */
export function registerEvents(
	dispatch: EventDispatcher<
		Record<string, Konva.KonvaEventObject<MouseEvent | PointerEvent | TouchEvent>>
	>,
	node: Konva.Node
) {
	KONVA_EVENTS.forEach((event) => {
		node.on(event, (payload) => {
			if (!dispatch(event, payload, { cancelable: true })) {
				payload.cancelBubble = true;
			}
		});
	});
}
