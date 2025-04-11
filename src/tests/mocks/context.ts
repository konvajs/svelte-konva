import Konva from 'konva';
import { Container, CONTAINER_COMPONENT_KEYS } from '$lib/util/manageContext';

/**
 * Currently testing in Svelte is very limited especially for special/unusual things like svelte-konva.
 * This is a workaround in order to trick a component into thinking that it is wrapped inside the provided svelte-konva parent container (but actually isn't).
 *
 * @param parent The mocked svelte-konva parent container kind
 * @param container HTML Div element (only required for Stage container)
 *
 * @returns The mocked context which should be provided to the render function of a test
 */
export function createMockParentContext(
	parent: Container,
	container?: HTMLDivElement
): Map<string, Konva.Container | null> {
	let konvaContainer;
	switch (parent) {
		case Container.Stage:
			if (!container) {
				throw new Error(
					'To create a Stage as parent you need to provide a HTML div element in the container argument of the function.'
				);
			}
			konvaContainer = new Konva.Stage({ container, width: 1000, height: 1000 });
			break;
		case Container.Layer:
			konvaContainer = new Konva.Layer();
			break;
		case Container.Group:
			konvaContainer = new Konva.Group();
			break;
		case Container.Label:
			konvaContainer = new Konva.Label();
			break;
		default:
			assertUnreachable(parent);
	}

	const mockContext = new Map();
	mockContext.set(CONTAINER_COMPONENT_KEYS[parent], konvaContainer);

	const otherKeys = CONTAINER_COMPONENT_KEYS.slice();
	otherKeys.splice(parent, 1);

	otherKeys.forEach((e) => {
		mockContext.set(e, null);
	});

	return mockContext;
}

function assertUnreachable(x: never): never {
	throw new Error(`Received unknown value ${x} in exhaustive switch block`);
}
