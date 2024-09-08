# Unreleased

# v1.0.0-next.1

- Only import necessary Konva code per component to minimize bundle size #195 (@CaptainCodeman)
- Fix broken label example in example page #194 (@CaptainCodeman)

# v1.0.0-next.0

**breaking changes** please refer to the [migration guide](./docs/svelte-konva-v1-migration.md) for detailed examples on how to update.

- Breaking: Update to Svelte v5
- Breaking: `config` prop is now splitted into individual props
- Breaking: Deprecated Svelte `on:event` syntax is no longer supported and replaced by event hooks named `on<konva event name>`
- Breaking: The Konva event object is now directly provided as payload on the new event hooks instead of being provided under the `detail` property of the payload
- Breaking: Changes in how reactivity works on dragend and transformend events with `staticConfig = false`. State changes are now only propagated if the corresponding prop is bound.
- Breaking: The Konva handle is now a component property that can be accessed directly on the component instance (read only)
- Improved handle prop safety by preventing the user from overwriting the internal handle of the svelte-konva components (see #136)
- Breaking: Passing restProps to the wrapper div of the `Stage` component is no longer supported. Instead props can be passed to the wrapper div using the new `divWrapperProps` prop on the `Stage` component.
- svelte-konva is now a runes-only library and fully compatible with Svelte 5 runes-only projects
- Update to SvelteKit v2
- Various dependency updates

# v0.3.1

**Version bump to update README, functionality remains unchanged**

- Added SvelteKit instructions to README.md
- Various dependency updates

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
