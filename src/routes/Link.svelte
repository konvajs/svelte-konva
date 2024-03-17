<!--
    @component
    
    This is a wrapper around an anchor html element. It automatically prefixes the provided link with the correct base directory path of the app.

    Only use this component for relative links that point to pages that are served by this app.
-->
<script lang="ts">
	import { base } from '$app/paths';
	import { page as appPage } from '$app/stores';

	type Props = {
		href: string;
		target?: string;
	};

	let { href, target = '_self' }: Props = $props();
</script>

<a href="{base}{href}" {target} class={$appPage.url.pathname === `${base}${href}` ? 'active' : ''}>
	<slot />
</a>
