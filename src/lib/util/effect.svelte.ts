/**
 * This function creates an $effect that allows the user to skip the first execution of the $effect during mounting
 *
 * The function supplied as argument is run inside the $effect. It receives a boolean flag which is `true` on the initial
 * execution and allows the function to skip the first $effect exection if required.
 *
 * **Caution**
 * If you skip the execution of the $effect all dependencies that were not called during the initial $effect run will
 * not be registered as dependencies of the $effect. To circumvent this you can do a dummy read of all dependencies
 * that should be tracked by the $effect before skipping the first exection.
 *
 * @param fn function to run in the $effect
 * @returns function which creates/initializes the lazy effect
 */
export default function lazyEffect(fn: (skip: boolean) => void) {
	let skipFirstExecution = true;

	return function () {
		$effect(() => {
			fn(skipFirstExecution);
			if (skipFirstExecution) {
				skipFirstExecution = false;
				return;
			}
		});
	};
}
