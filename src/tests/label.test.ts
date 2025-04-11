import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Label from '$lib/Label.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

// Test Component Wrappers
import ConfigBinding from './wrappers/ConfigBinding.test.svelte';
import ContainerContext from './wrappers/ContainerContext.test.svelte';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', () => {
	expect(() => {
		render(Label, {
			props: {}
		});
	}).toThrow(CONTAINER_ERROR);

	const div = document.createElement('div');
	expect(() => {
		render(Label, {
			context: createMockParentContext(Container.Stage, div),
			props: {
				config: {}
			}
		});
	}).toThrow(CONTAINER_ERROR);
});

test('is correctly added to the parent Layer', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Label, {
		context: mockContext,
		props: {}
	});

	const parent: Konva.Container = mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!;
	const node = rendered.component.node;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(node);
	}
});

test('is correctly added to the parent Group', () => {
	const mockContext = createMockParentContext(Container.Group);
	const rendered = render(Label, {
		context: mockContext,
		props: {}
	});

	const parent: Konva.Container = mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Group])!;
	const node = rendered.component.node;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(node);
	}
});

test('is correctly added to the parent Label', () => {
	const mockContext = createMockParentContext(Container.Label);
	const rendered = render(Label, {
		context: mockContext,
		props: {}
	});

	const parent: Konva.Container = mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Label])!;
	const node = rendered.component.node;

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(node);
	}
});

test('Can listen to Konva events', () => {
	const mockFn = vi.fn();
	const rendered = render(Label, {
		context: createMockParentContext(Container.Layer),
		props: {
			onmousedown: mockFn
		}
	});

	const node = rendered.component.node;

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100 });

	node.add(rectangle);
	stage.add(node.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = { x: 0, y: 0, draggable: true };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: Konva.Label | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: Label,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getNode: (nd) => (node = nd)
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100 });

	node!.add(rectangle);
	stage.add(node!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(50);
	expect(get(yWritable)).toEqual(50);
});

test('Does not update config if instantiated with staticConfig prop', async () => {
	const CONFIG = { x: 0, y: 0, draggable: true };
	const oldConfig = { ...CONFIG };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: Konva.Label | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: Label,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getNode: (nd) => (node = nd),
			staticConfig: true
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100 });

	node!.add(rectangle);
	stage.add(node!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(oldConfig.x);
	expect(get(yWritable)).toEqual(oldConfig.y);
});

test('sets the correct context', () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let childContext: Map<string, any> | null = null;
	let node: Konva.Label | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: Label,
			getNode: (nd) => (node = nd),
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	expect(childContext!.get(CONTAINER_COMPONENT_KEYS[Container.Label])).toStrictEqual(node!);
});

test('nulls unused context', () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let childContext: Map<string, any> | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: Label,
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Label, 1);

	otherKeys.forEach((e) => {
		expect(childContext!.get(e)).toBe(null);
	});
});

test('Konva instance is correctly destroyed on component unmount', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Label, {
		context: mockContext,
		props: {}
	});

	const parent: Konva.Container = mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!;

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
