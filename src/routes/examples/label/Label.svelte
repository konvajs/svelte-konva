<script lang="ts">
	import Stage from '../../ResponsiveStage.svelte';
	import type Konva from 'konva';

	// svelte-konva components
	import Circle from 'svelte-konva/Circle.svelte';
	import Layer from 'svelte-konva/Layer.svelte';
	import Label from 'svelte-konva/Label.svelte';
	import Tag from 'svelte-konva/Tag.svelte';
	import Text from 'svelte-konva/Text.svelte';
	import type { KonvaMouseEvent } from 'svelte-konva';

	let circles: Array<Konva.CircleConfig> = [];

	const COLORS = [
		'black',
		'green',
		'blue',
		'red',
		'yellow',
		'magenta',
		'cyan',
		'purple',
		'orange',
		'pink'
	];

	function init() {
		for (let i = 0; i < 10; i++) {
			circles[i] = {
				x: 800 * Math.random() + 100,
				y: 800 * Math.random() + 100,
				radius: 60 * Math.random() + 20,
				fill: COLORS[i],
				name: COLORS[i]
			};
		}
	}

	init();

	let labelConfig = {
		x: 0,
		y: 0,
		opacity: 0.8,
		visible: false
	};

	let labelTextConfig = {
		text: '',
		fontSize: 18,
		padding: 5,
		fill: 'white'
	};

	function handleMouseEnter(e: KonvaMouseEvent) {
		let hoveredElementPos = e.target.getPosition();
		let hoveredElementRadius = e.target.attrs.radius;
		let hoveredElementName = e.target.attrs.name;

		labelConfig.x = hoveredElementPos.x;
		labelConfig.y = hoveredElementPos.y - hoveredElementRadius;

		labelTextConfig.text = hoveredElementName;

		labelConfig.visible = true;
	}

	function handleMouseLeave() {
		labelConfig.visible = false;
	}
</script>

<Stage>
	<Layer>
		{#each circles as config}
			<Circle {...config} onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave} />
		{/each}

		<Label {...labelConfig}>
			<Tag
				fill="black"
				pointerDirection="down"
				pointerWidth={10}
				pointerHeight={10}
				lineJoin="round"
				shadowColor="black"
				shadowBlur={10}
				shadowOffsetX={10}
				shadowOffsetY={10}
				shadowOpacity={0.5}
			/>
			<Text {...labelTextConfig} />
		</Label>
	</Layer>
</Stage>
