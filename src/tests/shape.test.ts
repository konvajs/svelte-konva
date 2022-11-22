import { render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Konva from 'konva';

// svelte-konva
import Shape from '$lib/Shape.svelte';
import { CONTAINER_ERROR, Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

// Mocks
import { createMockParentContext } from './mocks/context';
import './mocks/mouse';
import type { MockStage } from './mocks/mouse';

test('throws an error if not placed inside a Container (Layer, Group, Label) component', () => {
	expect(() => {
		render(Shape, {
			props: {
				config: {
					width: 100,
					height: 100,
					sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
						context.beginPath();
						context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
						context.fillStrokeShape(shape);
					}
				}
			}
		});
	}).toThrow(CONTAINER_ERROR);

	const div = document.createElement('div');
	expect(() => {
		render(Shape, {
			context: createMockParentContext(Container.Stage, div),
			props: {
				config: {
					width: 100,
					height: 100,
					sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
						context.beginPath();
						context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
						context.fillStrokeShape(shape);
					}
				}
			}
		});
	}).toThrow(CONTAINER_ERROR);
});

test('is correctly added to the parent Layer', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			config: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		}
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
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			config: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		}
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
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			config: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		}
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

test('Can listen to Konva events', () => {
	const rendered = render(Shape, {
		context: createMockParentContext(Container.Layer),
		props: {
			config: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		}
	});

	const component = rendered.component.$$;
	const handle: Konva.Line = component.ctx[component.props['handle']];

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle.getLayer()!);

	const mockFn = jest.fn();
	rendered.component.$on('mousedown', mockFn);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });

	expect(mockFn).toHaveBeenCalledTimes(1);
});

test('Correctly updates bound config on dragend', () => {
	const CONFIG = {
		x: 0,
		width: 100,
		height: 100,
		sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
			context.beginPath();
			context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
			context.fillStrokeShape(shape);
		},
		draggable: true
	};
	const rendered = render(Shape, {
		context: createMockParentContext(Container.Layer),
		props: {
			config: CONFIG
		}
	});

	const component = rendered.component.$$;
	const handle: Konva.Line = component.ctx[component.props['handle']];

	const div = document.createElement('div');
	const stage = new Konva.Stage({ container: div, width: 1000, height: 1000 });

	stage.add(handle.getLayer()!);

	(stage as MockStage).simulateMouseDown({ x: 50, y: 50 });
	(stage as MockStage).simulateMouseMove({ x: 100, y: 100 });
	(stage as MockStage).simulateMouseUp({ x: 100, y: 100 });

	const config = component.ctx[component.props['config']];

	expect(config).toStrictEqual({ ...CONFIG, x: 50 });
});

test('Does not alter the context', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			config: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		}
	});

	const component = rendered.component.$$;
	const context = component.context;

	expect(context).toStrictEqual(mockContext);
});

test('Konva instance is correctly destroyed on component unmount', () => {
	const mockContext = createMockParentContext(Container.Layer);
	const rendered = render(Shape, {
		context: mockContext,
		props: {
			config: {
				width: 100,
				height: 100,
				sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {
					context.beginPath();
					context.rect(0, 0, shape.getAttr('width'), shape.getAttr('height'));
					context.fillStrokeShape(shape);
				}
			}
		}
	});

	const parent: Konva.Container = get(mockContext.get(CONTAINER_COMPONENT_KEYS[Container.Layer])!);

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(1);
	}

	rendered.unmount();

	const component = rendered.component.$$;
	const handle = component.ctx[component.props['handle']];

	expect(parent.children).toBeTruthy();

	if (parent.children) {
		expect(parent.children.length).toBe(0);
	}

	expect(handle).toBeUndefined();
});
