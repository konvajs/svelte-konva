import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Shape from '$lib/Shape.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

// Test Component Wrappers
import ConfigBinding from './wrappers/ConfigBinding.test.svelte';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', () => {
	expect(() => {
		render(Shape, {
			props: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		});
	}).toThrow(CONTAINER_ERROR);

	const div = document.createElement('div');
	expect(() => {
		render(Shape, {
			context: createMockParentContext(Container.Stage, div),
			props: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		});
	}).toThrow(CONTAINER_ERROR);
});

test('is correctly added to the parent Layer', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			width: 100,
			height: 100,
			sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
				context.beginPath();
				context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
				context.fillStrokeShape(shape);
			}
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!);
	const handle = rendered.component.handle;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('is correctly added to the parent Group', () => {
	const mockContext = createMockParentContext(Container.Group);
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			width: 100,
			height: 100,
			sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
				context.beginPath();
				context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
				context.fillStrokeShape(shape);
			}
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Group])!);
	const handle = rendered.component.handle;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('is correctly added to the parent Label', () => {
	const mockContext = createMockParentContext(Container.Label);
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			width: 100,
			height: 100,
			sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
				context.beginPath();
				context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
				context.fillStrokeShape(shape);
			}
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Label])!);
	const handle = rendered.component.handle;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('Can listen to Konva events', () => {
	const mockFn = vi.fn();
	const rendered = render(Shape, {
		context: createMockParentContext(Container.Layer),
		props: {
			width: 100,
			height: 100,
			sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
				context.beginPath();
				context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
				context.fillStrokeShape(shape);
			},
			onmousedown: mockFn
		}
	});

	const handle = rendered.component.handle;

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
			context.beginPath();
			context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
			context.fillStrokeShape(shape);
		},
		draggable: true
	};
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: Konva.Shape | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Shape,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd)
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(50);
	expect(get(yWritable)).toEqual(50);
});

test('Does not update config if instantiated with staticConfig prop', () => {
	const CONFIG = {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
			context.beginPath();
			context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
			context.fillStrokeShape(shape);
		},
		draggable: true
	};
	const oldConfig = { ...CONFIG };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: Konva.Shape | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Shape,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd),
			staticConfig: true
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(oldConfig.x);
	expect(get(yWritable)).toEqual(oldConfig.y);
});

test('Konva instance is correctly destroyed on component unmount', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			width: 100,
			height: 100,
			sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
				context.beginPath();
				context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
				context.fillStrokeShape(shape);
			}
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
