import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Konva from 'konva';
import { get, writable } from 'svelte/store';

// svelte-konva
import Layer from '$lib/Layer.svelte';
import { LAYER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

// Test Component Wrappers
import ConfigBinding from './wrappers/ConfigBinding.test.svelte';
import ContainerContext from './wrappers/ContainerContext.test.svelte';

test('throws an error if not placed inside a Stage component', () => {
	expect(() => {
		render(Layer);
	}).toThrow(LAYER_ERROR);

	expect(() => {
		render(Layer, { context: createMockParentContext(Container.Layer) });
	}).toThrow(LAYER_ERROR);

	expect(() => {
		render(Layer, { context: createMockParentContext(Container.Group) });
	}).toThrow(LAYER_ERROR);

	expect(() => {
		render(Layer, { context: createMockParentContext(Container.Label) });
	}).toThrow(LAYER_ERROR);
});

test('passes the config prop', () => {
	const CONFIG: Konva.LayerConfig = { x: 100, y: 100, visible: false };

	const div = document.createElement('div');
	const rendered = render(Layer, {
		context: createMockParentContext(Container.Stage, div),
		props: CONFIG
	});

	const handle = rendered.component.handle;

	expect(handle.getAttrs()).toStrictEqual(CONFIG);
});

test('is correctly added to the parent stage', () => {
	const div = document.createElement('div');
	const mockContext = createMockParentContext(Container.Stage, div);
	const rendered = render(Layer, {
		context: mockContext
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Stage])!);
	const handle = rendered.component.handle;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('Can listen to Konva events', () => {
	const div = document.createElement('div');
	const mockFn = vi.fn();
	const rendered = render(Layer, {
		context: createMockParentContext(Container.Stage, div),
		props: {
			onmousedown: mockFn
		}
	});

	const handle = rendered.component.handle;

	// As the layer only receives events if any of its children detects an event
	// we need to create a shape as child of the layer and start the event on that shape
	// in order to detect the event on the layer. Otherwise clicking on an empty layer only
	// results in a stage event.
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100 });
	handle.add(rectangle);

	const stage = handle.getStage();

	stage.draw();

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = { x: 0, y: 0, draggable: true };
	const div = document.createElement('div');
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: Konva.Layer | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Stage, div),
		props: {
			component: Layer,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd)
		}
	});

	const stage = handle!.getStage()!;
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100, fill: 'red' });

	handle!.add(rectangle);

	stage.draw();

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(50);
	expect(get(yWritable)).toEqual(50);
});

test('Does not update config if instantiated with staticConfig prop', async () => {
	const CONFIG = { x: 0, y: 0, draggable: true };
	const oldConfig = { ...CONFIG };
	const div = document.createElement('div');
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: Konva.Layer | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Stage, div),
		props: {
			component: Layer,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd),
			staticConfig: true
		}
	});

	const stage = handle!.getStage()!;
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100, fill: 'red' });

	handle!.add(rectangle);

	stage.draw();

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(oldConfig.x);
	expect(get(yWritable)).toEqual(oldConfig.y);
});

test('sets the correct context', () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const div = document.createElement('div');
	let childContext: Map<string, any> | null = null;
	let handle: Konva.Layer | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Stage, div),
		props: {
			component: Layer,
			getHandle: (hnd) => (handle = hnd),
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	expect(get(childContext!.get(CONTAINER_COMPONENT_KEYS[Container.Layer]))).toStrictEqual(handle!);
});

test('nulls unused context', () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	const div = document.createElement('div');
	let childContext: Map<string, any> | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Stage, div),
		props: {
			component: Layer,
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Layer, 1);

	otherKeys.forEach((e) => {
		expect(childContext!.get(e)).toBe(null);
	});
});

test('Konva instance is correctly destroyed on component unmount', () => {
	const div = document.createElement('div');
	const mockContext = createMockParentContext(Container.Stage, div);
	const rendered = render(Layer, {
		context: mockContext
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Stage])!);

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
