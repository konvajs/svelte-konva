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

/**
 * Registers all possible Konva node events with the provided Svelte dispatcher
 *
 * @param dispatch
 * @param node
 */
export function registerEvents(
	dispatch: EventDispatcher<any>, // TODO: Check if the Konva payloads can be fully typed
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
