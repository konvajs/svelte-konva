<script lang="ts">
	import { Stage, Layer, Star } from 'svelte-konva';
	import { onMount } from 'svelte';

	let stage: any;
	let width: number;
	let height: number;
	let list: any[] = [];
	onMount(() => {
		for (let n = 0; n < 5; n++) {
			list.push({
				id: `${n}`,
				x: Math.random() * width,
				y: Math.random() * height,
				rotation: Math.random() * 180,
				scale: Math.random()
			});
		}
	});

	let dragItemId: string | null = null;

	let handleDragStart = (e: any) => {
		// save drag element:
		dragItemId = e.detail.target.id();
		// move current element to the top:
		const item = list.find((i) => i.id === dragItemId);
		const index = list.indexOf(item);
		list.splice(index, 1);
		list.push(item);

		list = list;
	};
	let handleDragEnd = (e: any) => {
		const item = list.find((i) => i.id === dragItemId);
		if (!item) {
			return;
		}
		item.x = e.detail.target.x();
		item.y = e.detail.target.y();
		dragItemId = null;
	};

	function printOrder(window: Window, dragitem: any) {
		if (!stage) return;

		let children = (window as any).Konva.stages[0].children[0].children;

		children.forEach((e: any) => {
			console.log(`kidx: ${e.id()}, sidx: ${e.attrs.id}`);
		});
	}
	//$: printOrder(window, dragItemId);

	let showStar = true;
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<Stage config={{ width, height }} bind:handle={stage} on:dblclick={() => (showStar = !showStar)}>
	<Layer>
		{#if showStar}
			<Star
				config={{
					x: 200,
					y: 200,
					rotation: 10,
					id: '54885',
					numPoints: 5,
					innerRadius: 30,
					outerRadius: 50,
					fill: '#89b717',
					opacity: 0.8,
					draggable: true,
					scaleX: 1,
					scaleY: 1,
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffsetX: 15,
					shadowOffsetY: 15,
					shadowOpacity: 0.6
				}}
			/>
		{/if}
		{#each list as item (item.id)}
			<Star
				config={{
					x: item.x,
					y: item.y,
					rotation: item.rotation,
					id: item.id,
					numPoints: 5,
					innerRadius: 30,
					outerRadius: 50,
					fill: '#89b717',
					opacity: 0.8,
					draggable: true,
					scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
					scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
					shadowColor: 'black',
					shadowBlur: 10,
					shadowOffsetX: dragItemId === item.id ? 15 : 5,
					shadowOffsetY: dragItemId === item.id ? 15 : 5,
					shadowOpacity: 0.6
				}}
				on:dragstart={handleDragStart}
				on:dragend={handleDragEnd}
			/>
		{/each}

		<Star
			config={{
				x: 200,
				y: 200,
				rotation: 10,
				id: '548dfds85',
				numPoints: 5,
				innerRadius: 400,
				outerRadius: 500,
				fill: 'red',
				opacity: 0.8,
				draggable: true,
				scaleX: 1,
				scaleY: 1,
				shadowColor: 'black',
				shadowBlur: 10,
				shadowOffsetX: 15,
				shadowOffsetY: 15,
				shadowOpacity: 0.6
			}}
		/>
	</Layer>
	<!--<Layer />-->
</Stage>
