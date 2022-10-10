import { render } from '@testing-library/svelte';

import Layer from '$lib/Layer.svelte';
import { LAYER_ERROR } from '$lib/util/manageContext';

test('throws an error if not placed inside a Stage component', () => {
	expect(() => {
		render(Layer);
	}).toThrow(LAYER_ERROR);
});
