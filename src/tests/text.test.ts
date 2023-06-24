/**
 * WARNING: This component is autogenerated using the svelteKonvaComponentTests.hbs template. Do not edit this file manually!
 */
import { test, expect, vi } from "vitest";
import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Text from '$lib/Text.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', () => {
	expect(() => {
		render(Text, {
			props: {
				config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
			}
		});
	}).toThrow(CONTAINER_ERROR);

	const div = document.createElement('div');
	expect(() => {
		render(Text, {
			context: createMockParentContext(Container.Stage, div),
			props: {
				config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
			}
		});
	}).toThrow(CONTAINER_ERROR);
});

test('is correctly added to the parent Layer', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Text, {
		context: mockContext,
		props: {
			config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
		}
	});

	const component = rendered.component.$$;
	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!);
	const handle = component.ctx[component.props['handle'] as number];

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('is correctly added to the parent Group', () => {
	const mockContext = createMockParentContext(Container.Group);
	const rendered = render(Text, {
		context: mockContext,
		props: {
			config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
		}
	});

	const component = rendered.component.$$;
	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Group])!);
	const handle = component.ctx[component.props['handle'] as number];

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('is correctly added to the parent Label', () => {
	const mockContext = createMockParentContext(Container.Label);
	const rendered = render(Text, {
		context: mockContext,
		props: {
			config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
		}
	});

	const component = rendered.component.$$;
	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Label])!);
	const handle = component.ctx[component.props['handle'] as number];

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('Can listen to Konva events', () => {
	const rendered = render(Text, {
		context: createMockParentContext(Container.Layer),
		props: {
			config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
		}
	});

	const component = rendered.component.$$;
	const handle: Konva.Text = component.ctx[component.props['handle'] as number];

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle.getLayer()!);

	const mockFn = vi.fn();
	rendered.component.$on('mousedown', mockFn);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const rawConfig = { x: 0, fontSize: 100, text: 'some text', fill: 'black' };
	const CONFIG = { ...rawConfig, draggable: true };
	const rendered = render(Text, {
		context: createMockParentContext(Container.Layer),
		props: {
			config: CONFIG
		}
	});

	const component = rendered.component.$$;
	const handle: Konva.Text = component.ctx[component.props['handle'] as number];

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	const config = component.ctx[component.props['config'] as number];

	expect(config).toStrictEqual({ ...CONFIG, x: 50 });
});

test('Does not update config if instantiated with staticConfig prop', () => {
	const rawConfig = { x: 0, fontSize: 100, text: 'some text', fill: 'black' };
	const CONFIG = { ...rawConfig, draggable: true };
	const oldConfig = { ...CONFIG };
	const rendered = render(Text, {
		context: createMockParentContext(Container.Layer),
		props: {
			config: CONFIG,
			staticConfig: true
		}
	});

	const component = rendered.component.$$;
	const handle: Konva.Text = component.ctx[component.props['handle'] as number];

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	const config = component.ctx[component.props['config'] as number];

	expect(config).toStrictEqual(oldConfig);
});

test('Does not alter the context', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Text, {
		context: mockContext,
		props: {
			config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
		}
	});

	const component = rendered.component.$$;
	const context = component.context;

	expect(context).toStrictEqual(mockContext);
});

test('Konva instance is correctly destroyed on component unmount', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Text, {
		context: mockContext,
		props: {
			config: { x: 0, fontSize: 100, text: 'some text', fill: 'black' }
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!);

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
	}

	rendered.unmount();

	const component = rendered.component.$$;
	const handle = component.ctx[component.props['handle'] as number];

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(0);
	}

	expect(handle).toBeUndefined();
});
