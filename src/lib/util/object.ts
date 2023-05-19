/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Only copies fields from the source object that already exist on the target object, skipping everything else
 * @param target
 * @param source
 */
export function copyExistingKeys(target: { [key: string]: any }, source: { [key: string]: any }) {
	for (const key in target) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			target[key] = source[key];
		}
	}
}
