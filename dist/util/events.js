/**
 * Handles the registration of the user provided konva event hooks
 */
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
 * Registers all Konva node event hooks provided by the user
 *
 * @param eventHooks Hooks provided by the user that should be called in the event callback
 * @param node to listen konva events from
 */
export function registerEvents(eventHooks, node) {
    KONVA_EVENTS.forEach((event) => {
        const hook = eventHooks[`on${event}`];
        if (typeof hook === 'function') {
            node.on(event, (payload) => {
                // TODO: Make sure event bubbling can be canceled in the hook...
                // TODO: Make sure the listeners get cleaned up correctly and do not leak memory
                hook(payload);
            });
        }
    });
}
