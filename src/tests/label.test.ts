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
	const rendered = render(Label, {
		context: mockContext,
		props: {}
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
	const rendered = render(Label, {
		context: mockContext,
		props: {}
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
	const rendered = render(Label, {
		context: createMockParentContext(Container.Layer),
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
	const CONFIG = { x: 0, draggable: true };
	const configWritable = writable(CONFIG);
	let handle: Konva.Label | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Label,
			boundConfigWritable: configWritable,
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

	const config = get(configWritable);

	expect(config).toStrictEqual({ ...CONFIG, x: 50 });
});

test('Does not update config if instantiated with staticConfig prop', async () => {
	const CONFIG = { x: 0, draggable: true };
	const oldConfig = { ...CONFIG };
	const configWritable = writable(CONFIG);
	let handle: Konva.Label | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Label,
			boundConfigWritable: configWritable,
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

	const config = get(configWritable);

	expect(config).toStrictEqual(oldConfig);
});

test('sets the correct context', () => {
	let childContext: Map<string, any> | null = null;
	let handle: Konva.Label | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Label,
			getHandle: (hnd) => (handle = hnd),
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	expect(get(childContext!.get(CONTAINER_COMPONENT_KEYS[Container.Label]))).toStrictEqual(handle!);
});

test('nulls unused context', () => {
	let childContext: Map<string, any> | null = null;

	render(ContainerContext, {
		context: createMockParentContext(Container.Layer),
		props: {
			component: Label,
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
