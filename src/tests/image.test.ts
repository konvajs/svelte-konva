import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import Konva from 'konva';
import { loadImage } from './util';

// svelte-konva
import { default as KonvaImage } from '$lib/Image.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

// Test Component Wrappers
import ConfigBinding from './wrappers/ConfigBinding.test.svelte';

// Assets
const image =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkZFRjRDNTcxNEUyQTExRURBNDZEOEQ2MzlDQzY2RTAxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkZFRjRDNTcyNEUyQTExRURBNDZEOEQ2MzlDQzY2RTAxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RkVGNEM1NkY0RTJBMTFFREE0NkQ4RDYzOUNDNjZFMDEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RkVGNEM1NzA0RTJBMTFFREE0NkQ4RDYzOUNDNjZFMDEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4xu25cAAAABlBMVEX/lgAxljrbW7s6AAAAQUlEQVR42uzNMQ0AAAwDoM6/6Wno2QQMkNSuFolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSPaTF2AAnm0TiT0XtnYAAAAASUVORK5CYII=';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', async () => {
	const testImage = await loadImage(image);

	expect(() => {
		render(KonvaImage, {
			props: {
				image: testImage
			}
		});
	}).toThrow(CONTAINER_ERROR);

	const div = document.createElement('div');
	expect(() => {
		render(KonvaImage, {
			context: createMockParentContext(Container.Stage, div),
			props: {
				image: testImage
			}
		});
	}).toThrow(CONTAINER_ERROR);
});

test('is correctly added to the parent Layer', async () => {
	const testImage = await loadImage(image);

	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(KonvaImage, {
		context: mockContext,
		props: {
			image: testImage
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!);
	const node = rendered.component.node;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(node);
	}
});

test('is correctly added to the parent Group', async () => {
	const testImage = await loadImage(image);

	const mockContext = createMockParentContext(Container.Group);
	const rendered = render(KonvaImage, {
		context: mockContext,
		props: {
			image: testImage
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Group])!);
	const node = rendered.component.node;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(node);
	}
});

test('is correctly added to the parent Label', async () => {
	const testImage = await loadImage(image);

	const mockContext = createMockParentContext(Container.Label);
	const rendered = render(KonvaImage, {
		context: mockContext,
		props: {
			image: testImage
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Label])!);
	const node = rendered.component.node;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(node);
	}
});

test('Can listen to Konva events', async () => {
	const testImage = await loadImage(image);

	const mockFn = vi.fn();
	const rendered = render(KonvaImage, {
		context: createMockParentContext(Container.Layer),
		props: {
			image: testImage,
			onmousedown: mockFn
		}
	});

	const node = rendered.component.node;

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(node.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', async () => {
	const testImage = await loadImage(image);

	const CONFIG = {
		x: 0,
		y: 0,
		image: testImage,
		draggable: true
	};
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: Konva.Image | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: KonvaImage,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getNode: (nd) => (node = nd)
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(node!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(50);
	expect(get(yWritable)).toEqual(50);
});

test('Does not update config if instantiated with staticConfig prop', async () => {
	const testImage = await loadImage(image);

	const CONFIG = {
		x: 0,
		y: 0,
		image: testImage,
		draggable: true
	};
	const oldConfig = { ...CONFIG };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: Konva.Image | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: KonvaImage,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getNode: (nd) => (node = nd),
			staticConfig: true
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(node!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(oldConfig.x);
	expect(get(yWritable)).toEqual(oldConfig.y);
});

test('Konva instance is correctly destroyed on component unmount', async () => {
	const testImage = await loadImage(image);

	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(KonvaImage, {
		context: mockContext,
		props: {
			image: testImage
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!);

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
	}

	rendered.unmount();

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(0);
	}
});
