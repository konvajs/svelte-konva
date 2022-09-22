<script lang="ts">
</script>

<div class="nav">
	<button class="nav-button"><a href="/">home</a></button>
	<button class="nav-button"><a href="/z-index">z-index</a></button>
	<button class="nav-button"><a href="/group">grouping</a></button>
	<button class="nav-button"><a href="/event">events</a></button>
	<button class="nav-button"><a href="/transform">transform</a></button>
	<button class="nav-button"><a href="/drawing">drawing</a></button>
	<button class="nav-button"><a href="/binding">binding</a></button>
</div>

<div class="content">
	<slot />
</div>

<style>
	.nav {
		display: flex;
		justify-content: center;
		align-content: center;
		flex-direction: row;
	}

	.nav-button {
		margin: 5px;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-content: center;
	}
</style>
