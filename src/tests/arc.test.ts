/**
 * WARNING: This component is autogenerated using the svelteKonvaComponentTests.hbs template. Do not edit this file manually!
 */
import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Arc from '$lib/Arc.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

// Test Component Wrappers
import ConfigBinding from './wrappers/ConfigBinding.test.svelte';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', () => {
	expect(() => {
		render(Arc, {
			props: { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 }
		});
	}).toThrow(CONTAINER_ERROR);

	const div = document.createElement('div');
	expect(() => {
		render(Arc, {
			context: createMockParentContext(Container.Stage, div),
			props: { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 }
		});
	}).toThrow(CONTAINER_ERROR);
});

test('is correctly added to the parent Layer', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Arc, {
		context: mockContext,
		props: { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 }
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
	const rendered = render(Arc, {
		context: mockContext,
		props: { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 }
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
	const rendered = render(Arc, {
		context: mockContext,
		props: { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 }
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
	const rendered = render(Arc, {
		context: createMockParentContext(Container.Layer),
		props: {
			...{ x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 },
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

test('Correctly updates bound config on dragend', () => {
	const rawConfig = { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 };
	const CONFIG = { ...rawConfig, draggable: true };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: Konva.Arc | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: Arc,
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

test('Does not update config if instantiated with staticConfig prop', () => {
	const rawConfig = { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 };
	const CONFIG = { ...rawConfig, draggable: true };
	const oldConfig = { ...CONFIG };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: Konva.Arc | null = null;

	render(ConfigBinding, {
		context: createMockParentContext(Container.Layer),
		props: {
			Component: Arc,
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

test('Konva instance is correctly destroyed on component unmount', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Arc, {
		context: mockContext,
		props: { x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 }
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
