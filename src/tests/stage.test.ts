import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Stage from '$lib/Stage.svelte';
import { CONTAINER_COMPONENT_KEYS, Container } from '$lib/util/manageContext';

// Mocks
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

// Test Component Wrappers
import ConfigBindingStage from './wrappers/ConfigBindingStage.test.svelte';
import ContainerContext from './wrappers/ContainerContext.test.svelte';

test('creates a div container and forwards divWrapperProps props to div', () => {
	const rendered = render(Stage, {
		props: {
			width: 1000,
			height: 1000,
			divWrapperProps: {
				id: 'container',
				someProp: false
			}
		}
	});

	const div = rendered.container.querySelector('#container');
	expect(div).toBeTruthy();

	expect(div).toBeInstanceOf(HTMLDivElement);

	if (div) expect(div.getAttribute('someProp')).toBe('false');
});

test('creates a Konva canvas instance inside of the div', () => {
	const rendered = render(Stage, {
		props: {
			width: 1000,
			height: 1000,
			divWrapperProps: {
				id: 'container'
			}
		}
	});

	const div = rendered.container.querySelector('#container');
	expect(div).toBeTruthy();

	if (div) {
		expect(div.children.length).toBe(1);

		const child = div.children[0];

		expect(child).toBeInstanceOf(HTMLDivElement);
		expect(child.getAttribute('class')).toBe('konvajs-content');
	}
});

test('creates a konva stage instance and passes config prop', () => {
	const CONFIG = { width: 1000, height: 1000 };

	const rendered = render(Stage, {
		props: {
			...CONFIG,
			id: 'container'
		}
	});

	const node = rendered.component.node;

	expect(node).toBeTruthy();

	expect(node).toBeInstanceOf(Konva.Stage);

	expect((node as Konva.Stage).getSize()).toStrictEqual(CONFIG);
});

test('Can listen to Konva events', () => {
	const mockFn = vi.fn();

	const rendered = render(Stage, {
		width: 1000,
		height: 1000,
		onmousedown: mockFn
	});

	const node = rendered.component.node;

	(node as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = { x: 0, y: 0, width: 1000, height: 1000, draggable: true };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: MockStage | null = null;

	render(ConfigBindingStage, {
		props: {
			Component: Stage,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getNode: (nd) => (node = nd)
		}
	});

	node!.simulateMouseDown({ x: 50, y: 50 });
	node!.simulateMouseMove({ x: 100, y: 100 });
	node!.simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(50);
	expect(get(yWritable)).toEqual(50);
});

test('Does not update config if instantiated with staticConfig prop', async () => {
	const CONFIG = { x: 0, y: 0, width: 1000, height: 1000, draggable: true };
	const oldConfig = { ...CONFIG };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let node: MockStage | null = null;

	render(ConfigBindingStage, {
		props: {
			Component: Stage,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getNode: (nd) => (node = nd),
			staticConfig: true
		}
	});

	node!.simulateMouseDown({ x: 50, y: 50 });
	node!.simulateMouseMove({ x: 100, y: 100 });
	node!.simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(oldConfig.x);
	expect(get(yWritable)).toEqual(oldConfig.y);
});

test('sets the correct context', () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let childContext: Map<string, any> | null = null;
	let node: Konva.Stage | null = null;

	render(ContainerContext, {
		props: {
			Component: Stage,
			width: 1000,
			height: 1000,
			getNode: (nd) => (node = nd),
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	expect(get(childContext!.get(CONTAINER_COMPONENT_KEYS[Container.Stage]))).toStrictEqual(node!);
});

test('nulls unused context', () => {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	let childContext: Map<string, any> | null = null;

	render(ContainerContext, {
		props: {
			Component: Stage,
			width: 1000,
			height: 1000,
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Stage, 1);

	otherKeys.forEach((e) => {
		expect(childContext!.get(e)).toBe(null);
	});
});

test('Konva instance is correctly destroyed on component unmount', () => {
	// TODO: Currently a workaround as all tests run inside the same worker thus resulting in multiple stages
	const previousStageCount = Konva.stages.length;

	const rendered = render(Stage, {
		props: {
			width: 1000,
			height: 1000
		}
	});

	expect(Konva.stages.length).toBe(previousStageCount + 1);

	rendered.unmount();

	expect(Konva.stages.length).toBe(previousStageCount);
});
