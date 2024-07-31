import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Konva from 'konva';
import { get, writable } from 'svelte/store';

// svelte-konva
import Group from '$lib/Group.svelte';
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
		render(Group);
	}).toThrow(CONTAINER_ERROR);

	const div = document.createElement('div');
	expect(() => {
		render(Group, { context: createMockParentContext(Container.Stage, div) });
	}).toThrow(CONTAINER_ERROR);
});

test('passes the config prop', () => {
	const CONFIG: Konva.GroupConfig = { x: 100, y: 100, visible: false };

	const rendered = render(Group, {
		context: createMockParentContext(Container.Layer),
		props: CONFIG
	});

	const handle = rendered.component.handle;

	expect(handle.getAttrs()).toStrictEqual(CONFIG);
});

test('is correctly added to the parent Layer', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Group, {
		context: mockContext
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
	const rendered = render(Group, {
		context: mockContext
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
	const rendered = render(Group, {
		context: mockContext
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
	const mockContext = createMockParentContext(Container.Layer);
	const mockFn = vi.fn();
	const rendered = render(Group, {
		context: mockContext,
		props: {
			onmousedown: mockFn
		}
	});

	const handle = rendered.component.handle;

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100 });

	handle.add(rectangle);
	stage.add(handle.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = { x: 0, y: 0, draggable: true };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: Konva.Group | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Group,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd)
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100 });

	handle!.add(rectangle);
	stage.add(handle!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(50);
	expect(get(yWritable)).toEqual(50);
});

test('Does not update config if instantiated with staticConfig prop', () => {
	const CONFIG = { x: 0, y: 0, draggable: true };
	const oldConfig = { ...CONFIG };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: Konva.Group | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Group,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd),
			staticConfig: true
		}
	});

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });
	const rectangle = new Konva.Rect({ x: 0, y: 0, width: 100, height: 100 });

	handle!.add(rectangle);
	stage.add(handle!.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(oldConfig.x);
	expect(get(yWritable)).toEqual(oldConfig.y);
});

test('sets the correct context', () => {
	let childContext: Map<string, any> | null = null;
	let handle: Konva.Group | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Group,
			getHandle: (hnd) => (handle = hnd),
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	expect(get(childContext!.get(CONTAINER_COMPONENT_KEYS[Container.Group]))).toStrictEqual(handle!);
});

test('nulls unused context', () => {
	let childContext: Map<string, any> | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Group,
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Group, 1);

	otherKeys.forEach((e) => {
		expect(childContext!.get(e)).toBe(null);
	});
});

test('Konva instance is correctly destroyed on component unmount', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Group, {
		context: mockContext
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
