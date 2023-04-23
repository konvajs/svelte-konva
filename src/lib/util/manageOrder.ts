/**
 * Manages the automatic reordering of the Konva nodes according to their position in svelte
 */

import type Konva from 'konva';
import { getContext, setContext, tick } from 'svelte';
import type { KonvaContainer } from './manageContext';

const CONTAINER_ORDER_MANAGER_KEY = 'svelte-konva-order';

export function setOrderManagerContext(value: OrderManager) {
	setContext(CONTAINER_ORDER_MANAGER_KEY, value);
}

export function getOrderManager(): OrderManager {
	return getContext<OrderManager>(CONTAINER_ORDER_MANAGER_KEY);
}

export class OrderManager {
	private currentOrder: Array<Konva.Node> = [];
	private container: KonvaContainer;

	constructor(container: KonvaContainer) {
		this.container = container;
	}

	signalComponentOrder(component: Konva.Node) {
		this.currentOrder.push(component);

		// Schedule redrawing on next tick
		tick().then(() => {
			this.redraw();
		});
	}

	private redraw() {
		if (this.currentOrder.length <= 1) return;

		let konvaIndexes: Array<number> = [];

		this.currentOrder.map((component: Konva.Node) => {
			konvaIndexes.push(component.index);
		});

		konvaIndexes = konvaIndexes.sort((a, b) => a - b);

		// The position of the nodes inside the currentOrder const resembles the current position in svelte
		// while the konvaIndexes array represents the indexes of all components in the currentOrder array.
		//
		// Therefore, the function now reassigns the available indexes from lowest to highest according to the
		// component order inside the currentOrder Array.
		this.currentOrder.forEach((component: Konva.Node) => {
			component.zIndex(konvaIndexes.pop()!);
		});

		this.currentOrder = [];

		const drawingNode: null | Konva.Layer | Konva.Stage =
			this.container.getLayer() ?? this.container.getStage();

		if (drawingNode) drawingNode.batchDraw();
	}
}
