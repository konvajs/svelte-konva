import type Konva from 'konva';
import type { DispatchOptions } from 'svelte/internal';

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

export function registerEvents(
	dispatch: <EventKey extends string>(
		type: EventKey,
		detail?: any,
		options?: DispatchOptions | undefined
	) => boolean,
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
