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

test('creates a div container and forwards rest props to div', () => {
	const rendered = render(Stage, {
		props: {
			width: 1000,
			height: 1000,
			id: 'container',
			restProp: false
		}
	});

	const div = rendered.container.querySelector('#container');
	expect(div).toBeTruthy();

	expect(div).toBeInstanceOf(HTMLDivElement);

	if (div) expect(div.getAttribute('restProp')).toBe('false');
});

test('creates a Konva canvas instance inside of the div', () => {
	const rendered = render(Stage, {
		props: {
			width: 1000,
			height: 1000,
			id: 'container'
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

	const handle = rendered.component.handle();

	expect(handle).toBeTruthy();

	expect(handle).toBeInstanceOf(Konva.Stage);

	expect((handle as Konva.Stage).getSize()).toStrictEqual(CONFIG);
});

test('Can listen to Konva events', () => {
	const mockFn = vi.fn();

	const rendered = render(Stage, {
		width: 1000,
		height: 1000,
		onmousedown: mockFn
	});

	const handle = rendered.component.handle();

	(handle as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = { x: 0, y: 0, width: 1000, height: 1000, draggable: true };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: MockStage | null = null;

	render(ConfigBindingStage, {
		props: {
			component: Stage,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd())
		}
	});

	handle!.simulateMouseDown({ x: 50, y: 50 });
	handle!.simulateMouseMove({ x: 100, y: 100 });
	handle!.simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(50);
	expect(get(yWritable)).toEqual(50);
});

test('Does not update config if instantiated with staticConfig prop', async () => {
	const CONFIG = { x: 0, y: 0, width: 1000, height: 1000, draggable: true };
	const oldConfig = { ...CONFIG };
	const xWritable = writable(CONFIG.x);
	const yWritable = writable(CONFIG.y);
	let handle: MockStage | null = null;

	render(ConfigBindingStage, {
		props: {
			component: Stage,
			...CONFIG,
			x: xWritable,
			y: yWritable,
			getHandle: (hnd) => (handle = hnd()),
			staticConfig: true
		}
	});

	handle!.simulateMouseDown({ x: 50, y: 50 });
	handle!.simulateMouseMove({ x: 100, y: 100 });
	handle!.simulateMouseUp({ x: 100, y: 100 });

	expect(get(xWritable)).toEqual(oldConfig.x);
	expect(get(yWritable)).toEqual(oldConfig.y);
});

test('sets the correct context', () => {
	let childContext: Map<string, any> | null = null;
	let handle: Konva.Stage | null = null;

	render(ContainerContext, {
		props: {
			component: Stage,
			width: 1000,
			height: 1000,
			getHandle: (hnd) => (handle = hnd()),
			getComponentContext: (ctxMap) => (childContext = ctxMap)
		}
	});

	expect(get(childContext!.get(CONTAINER_COMPONENT_KEYS[Container.Stage]))).toStrictEqual(handle!);
});

test('nulls unused context', () => {
	let childContext: Map<string, any> | null = null;

	render(ContainerContext, {
		props: {
			component: Stage,
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
