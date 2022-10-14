import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Stage from '$lib/Stage.svelte';
import { CONTAINER_COMPONENT_KEYS, Container } from '$lib/util/manageContext';

// Mocks
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

test('creates a div container and forwards rest props to div', () => {
	const rendered = render(Stage, {
		config: { width: 1000, height: 1000 },
		id: 'container',
		restProp: false
	});

	const div = rendered.container.querySelector('#container');
	expect(div).toBeTruthy();

	expect(div).toBeInstanceOf(HTMLDivElement);

	if (div) expect(div.getAttribute('restProp')).toBe('false');
});

test('creates a Konva canvas instance inside of the div', () => {
	const rendered = render(Stage, {
		config: { width: 1000, height: 1000 },
		id: 'container'
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
		config: CONFIG,
		id: 'container'
	});

	const component = rendered.component.$$;
	const handle = component.ctx[component.props['handle']];

	expect(handle).toBeTruthy();

	expect(handle).toBeInstanceOf(Konva.Stage);

	expect((handle as Konva.Stage).getSize()).toStrictEqual(CONFIG);
});

test('Can listen to Konva events', () => {
	const rendered = render(Stage, {
		config: { width: 1000, height: 1000 }
	});

	const component = rendered.component.$$;
	const handle: MockStage = component.ctx[component.props['handle']];

	const mockFn = jest.fn();
	rendered.component.$on('mousedown', mockFn);

	handle.simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = { x: 0, width: 1000, height: 1000, draggable: true };
	const rendered = render(Stage, {
		config: CONFIG
	});

	const component = rendered.component.$$;
	const handle: MockStage = component.ctx[component.props['handle']];

	handle.simulateMouseDown({ x: 50, y: 50 });
	handle.simulateMouseMove({ x: 100, y: 100 });
	handle.simulateMouseUp({ x: 100, y: 100 });

	const config = component.ctx[component.props['config']];

	expect(config).toStrictEqual({ ...CONFIG, x: 50 });
});

test('sets the correct context', () => {
	const rendered = render(Stage, {
		config: { width: 1000, height: 1000 }
	});

	const component = rendered.component.$$;
	const context = component.context;
	const handle = component.ctx[component.props['handle']];

	expect(get(context.get(CONTAINER_COMPONENT_KEYS[Container.Stage]))).toStrictEqual(handle);
});

test('nulls unused context', () => {
	const rendered = render(Stage, {
		config: { width: 1000, height: 1000 }
	});

	const component = rendered.component.$$;
	const context = component.context;

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(Container.Stage, 1);

	otherKeys.forEach((e) => {
		expect(context.get(e)).toBe(null);
	});
});

test('Konva instance is correctly destroyed on component unmount', () => {
	const rendered = render(Stage, {
		config: { width: 1000, height: 1000 }
	});

	expect(Konva.stages.length).toBe(1);

	rendered.unmount();

	const component = rendered.component.$$;
	const handle = component.ctx[component.props['handle']];

	expect(Konva.stages.length).toBe(0);
	expect(handle).toBeUndefined();
});
