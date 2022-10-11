import { render } from '@testing-library/svelte';

import Group from '$lib/Group.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';
import type Konva from 'konva';
import { get } from 'svelte/store';

// Mocks
import { createMockParentContext } from './mocks/context';

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
		props: {
			config: CONFIG
		}
	});

	const component = rendered.component.$$;
	const handle: Konva.Group = component.ctx[component.props['handle']];

	expect(handle.getAttrs()).toStrictEqual(CONFIG);
});

test('is correctly added to the parent Layer', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Group, {
		context: mockContext
	});

	const component = rendered.component.$$;
	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!);
	const handle = component.ctx[component.props['handle']];

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

	const component = rendered.component.$$;
	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Group])!);
	const handle = component.ctx[component.props['handle']];

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

	const component = rendered.component.$$;
	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Label])!);
	const handle = component.ctx[component.props['handle']];

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
		expect(parent.children[0]).toStrictEqual(handle);
	}
});

test('sets the correct context', () => {
	const rendered = render(Group, {
		context: createMockParentContext(Container.Layer)
	});

	const component = rendered.component.$$;
	const context = component.context;
	const handle = component.ctx[component.props['handle']];

	expect(get(context.get(CONTAINER_COMPONENT_KEYS[Container.Group]))).toStrictEqual(handle);
});

test('nulls unused context', () => {
	const rendered = render(Group, {
		context: createMockParentContext(Container.Layer)
	});

	const component = rendered.component.$$;
	const context = component.context;

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Group, 1);

	otherKeys.forEach((e) => {
		expect(context.get(e)).toBe(null);
	});
});
