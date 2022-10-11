import { render } from '@testing-library/svelte';

import Layer from '$lib/Layer.svelte';
import { LAYER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';
import type Konva from 'konva';
import { get } from 'svelte/store';

// Mocks
import { createMockParentContext } from './mocks/context';

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
		props: {
			config: CONFIG
		}
	});

	const component = rendered.component.$$;
	const handle: Konva.Layer = component.ctx[component.props['handle']];

	expect(handle.getAttrs()).toStrictEqual(CONFIG);
});

test('is correctly added to the parent stage', () => {
	const div = document.createElement('div');
	const mockContext = createMockParentContext(Container.Stage, div);
	const rendered = render(Layer, {
		context: mockContext
	});

	const component = rendered.component.$$;
	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Stage])!);
	const handle = component.ctx[component.props['handle']];

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('sets the correct context', () => {
	const div = document.createElement('div');
	const rendered = render(Layer, {
		context: createMockParentContext(Container.Stage, div)
	});

	const component = rendered.component.$$;
	const context = component.context;
	const handle = component.ctx[component.props['handle']];

	expect(get(context.get(CONTAINER_COMPONENT_KEYS[Container.Layer]))).toStrictEqual(handle);
});

test('nulls unused context', () => {
	const div = document.createElement('div');
	const rendered = render(Layer, {
		context: createMockParentContext(Container.Stage, div)
	});

	const component = rendered.component.$$;
	const context = component.context;

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Layer, 1);

	otherKeys.forEach((e) => {
		expect(context.get(e)).toBe(null);
	});
});
