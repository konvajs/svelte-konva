<script lang="ts">
	import '../app.css';
	import Link from './Link.svelte';
	import { darkMode } from './stores';

	const { children } = $props();

	let examples = [
		{
			name: 'Label',
			url: '/examples/label'
		},
		{
			name: 'Grouping',
			url: '/examples/group'
		},
		{
			name: 'Select and Transform',
			url: '/examples/transform'
		},
		{
			name: 'Free drawing',
			url: '/examples/drawing'
		},
		{
			name: 'Connect four',
			url: '/examples/connectFour'
		}
	];
</script>

<div data-theme={$darkMode ? 'dark' : 'bumblebee'}>
	<div class="drawer lg:drawer-open">
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col items-center">
			<div class="navbar">
				<div class="navbar-start">
					<label
						for="my-drawer-2"
						class="btn btn-primary btn-square btn-ghost drawer-button lg:hidden"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="inline-block w-5 h-5 stroke-current"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						></label
					>
				</div>
				<div class="navbar-center">
					<p class="normal-case text-xl font-bold">svelte-konva examples</p>
				</div>
				<div class="navbar-end">
					<a
						href="https://github.com/konvajs/svelte-konva"
						class="btn btn-square btn-ghost"
						aria-label="svelte-konva on GitHub"
					>
						<svg viewBox="0 0 24 24" aria-hidden="true" class="h-7 w-7 fill-base-content"
							><path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
							/>
						</svg>
					</a>
					<button class="btn btn-square btn-ghost" onclick={() => darkMode.set(!$darkMode)}>
						{#if $darkMode}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
								/>
							</svg>
						{/if}
					</button>
				</div>
			</div>
			<div class="prose lg:prose-xl mt-10 mb-10 max-w-6xl w-full p-6" style="font-size: 1rem;">
				<!-- Page content here -->
				{@render children()}
			</div>
		</div>
		<div class="drawer-side shadow-sm">
			<label for="my-drawer-2" class="drawer-overlay"></label>
			<ul class="menu menu-compact p-4 overflow-y-auto w-80 bg-base-200 text-base-content h-full">
				<!-- Sidebar content here -->
				<li>
					<Link href="/">Home</Link>
				</li>
				<li>
					<a href="https://konvajs.org/docs/svelte" rel="noreferrer">Documentation</a>
				</li>
				<li class="menu-title"><span>Examples</span></li>
				{#each examples as page (page.name)}
					<li>
						<Link href={page.url}>{page.name}</Link>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
