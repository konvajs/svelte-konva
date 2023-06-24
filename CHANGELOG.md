# Unreleased

- -

# v0.3.0

- Added component event typings. This should significantly improve autocompletion and suggestions when using the on:event syntax for Konva events
- Added strong typings for component event payloads. This change might break your typings in case you used a wrong type for the event payload in your event handlers. To fix this, type the event payload of your function using the new payload types exported by svelte-konva: `KonvaMouseEvent`, `KonvaWheelEvent`, `KonvaTouchEvent`, `KonvaPointerEvent` and `KonvaDragTransformEvent`
- Tightened peer dependencies to only match specific major versions instead of matching all major versions starting from a certain version. This avoids svelte-konva being used in future major versions of Svelte or Konva which might break it
- Updated to Svelte 4 (the library is still fully compatible with Svelte v3)
- Change Testing from Jest to Vitest which simplifies the configuration
- Various dependency updates

# v0.2.0

- Updated all links (docs, etc) to official Konva homepage
- Added the `staticConfig` prop to all components. This prop controls whether svelte-konva dynamically updates the config prop on `dragend` and `transformend` events (See README for more details).
- Various dependency updates

# v0.1.1

- Update to SvelteKit v1 (library is now fully compatible with SvelteKit v1)
- Other dependency updates

# v0.1.0

- Initial release
