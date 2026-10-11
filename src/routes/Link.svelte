<script lang="ts">
	import { page as appPage } from '$app/state';
	import type { ResolvedPathname } from '$app/types';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		href: ResolvedPathname;
		target?: string;
	};

	let { children, href, target = '_self' }: Props = $props();
</script>

<!--
    @component
    
    This is a wrapper around an anchor html element. It automatically prefixes the provided link with the correct base directory path of the app.

    Only use this component for relative links that point to pages that are served by this app.
-->

<a {href} {target} class={appPage.url.pathname === `${href}`.slice(1) ? 'active' : ''}
	>{@render children()}</a
>
