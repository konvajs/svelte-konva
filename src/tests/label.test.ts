import { render } from '@testing-library/svelte';

import Label from '$lib/Label.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';
import { get } from 'svelte/store';

// Mocks
import { createMockParentContext } from './mocks/context';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', () => {
	expect(() => {
		render(Label, {
			props: {
				config: {}
			}
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

test('sets the correct context', () => {
	const rendered = render(Label, {
		context: createMockParentContext(Container.Layer),
		props: {
			config: {}
		}
	});

	const component = rendered.component.$$;
	const context = component.context;
	const handle = component.ctx[component.props['handle']];

	expect(get(context.get(CONTAINER_COMPONENT_KEYS[Container.Label]))).toStrictEqual(handle);
});

test('nulls unused context', () => {
	const rendered = render(Label, {
		context: createMockParentContext(Container.Layer),
		props: {
			config: {}
		}
	});

	const component = rendered.component.$$;
	const context = component.context;

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Label, 1);

	otherKeys.forEach((e) => {
		expect(context.get(e)).toBe(null);
	});
});
