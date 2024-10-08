/** List of all svelte-konva components that are autogenerated */
const COMPONENT_LIST = [
	{
		componentName: 'Circle',
		example: '<Circle x={100} y={100} radius={50} fill="blue" />',
		testConfig: '{ x: 0, y: 0, radius: 100 }'
	},
	{
		componentName: 'Rect',
		example: '<Rect x={100} y={100} width={100} height={100} fill="blue" />',
		testConfig: '{ x: 0, y: 0, width: 100, height: 100 }'
	},
	{
		componentName: 'Ellipse',
		example: '<Ellipse x={100} y={100} radiusX={50} radiusY={25} fill="blue"/>',
		testConfig: '{ x: 0, y: 0, radiusX: 120, radiusY: 70 }'
	},
	{
		componentName: 'Wedge',
		example: '<Wedge x={100} y={100} radius={100} angle={120} fill="blue" />',
		testConfig: '{ x: 0, y: 0, radius: 100, angle: 300 }'
	},
	{
		componentName: 'Line',
		example: '<Line points={[0, 0, 60, 30, 300, 90, 30, 100]} stroke="blue" strokeWidth={10} />',
		testConfig: "{ x: 0, y: 0, points: [0, 0, 100, 100], strokeWidth: 10, stroke: 'black' }"
	},
	{
		componentName: 'Sprite',
		example:
			'<Sprite x={100} y={100} image={imageObj} animation="idle" animations={animations} frameRate={7} frameIndex={0} />'
	},
	{
		componentName: 'Image',
		example: '<Image x={100} y={100} image={imageObj} width={100} height={100} />'
	},
	{
		componentName: 'Text',
		example: '<Text x={100} y={100} text="some text" fontSize={25} fill="blue" />',
		testConfig: "{ x: 0, y: 0, fontSize: 100, text: 'some text', fill: 'black' }"
	},
	{
		componentName: 'TextPath',
		example:
			'<TextPath x={100} y={100} fill="#333" text="some text" fontSize={25} data="M10 10 C0 0 10 150 100 100 S300 150 5.0.300" />',
		testConfig: "{ x: 0, y: 0, fontSize: 100, text: 'some text', data: 'M 1 60 H 168 Z' }"
	},
	{
		componentName: 'Star',
		example: '<Star x={100} y={100} innerRadius={25} outerRadius={50} numPoints={5} fill="blue" />',
		testConfig: '{ x: 0, y: 0, innerRadius: 100, outerRadius: 200, numPoints: 5 }'
	},
	{
		componentName: 'Ring',
		example: '<Ring x={100} y={100} innerRadius={25} outerRadius={50} fill="blue" />',
		testConfig: '{ x: 0, y: 0, innerRadius: 20, outerRadius: 100 }'
	},
	{
		componentName: 'Arc',
		example: '<Arc x={100} y={100} innerRadius={25} outerRadius={50} angle={120} fill="blue" />',
		testConfig: '{ x: 0, y: 0, innerRadius: 20, outerRadius: 100, angle: 300 }'
	},
	{
		componentName: 'Path',
		example:
			'<Path x={100} y={100} width={100} height={100} fill="blue" data="M213.1,6.7c-32.4-14.4-73.7,0-88.1,30.6C110.6,4.9,67.5-9.5,36.9,6.7C2.8,22.9-13.4,62.4,13.5,110.9C33.3,145.1,67.5,170.3,125,217c59.3-46.7,93.5-71.9,111.5-106.1C263.4,64.2,247.2,22.9,213.1,6.7z" />',
		testConfig: "{ x: 0, y: 0, data: 'M 2 2 H 100 V 60 H 2 V 2 Z' }"
	},
	{
		componentName: 'RegularPolygon',
		example: '<RegularPolygon x={100} y={100} sides={7} radius={70} fill="blue" />',
		testConfig: '{ x: 0, y: 0, sides: 7, radius: 80 }'
	},
	{
		componentName: 'Arrow',
		example:
			'<Arrow x={100} y={100} points={[0, 0, 40, 40]} pointerLength={20} pointerWidth={20} fill="blue" stroke="blue" strokeWidth={6} />',
		testConfig: "{ x: 0, y: 0, points: [0, 0, 100, 100], strokeWidth: 10, stroke: 'black' }"
	},
	{
		componentName: 'Shape',
		example: '<Shape x={100} y={100} width={100} height={50} fill="blue" sceneFunc={() => {}} />'
	},
	{
		componentName: 'Tag',
		example:
			'<Tag x={10} y={20} fill="black" pointerDirection="down" pointerWidth={10} pointerHeight={10} lineJoin="round" />',
		testConfig: "{ x: 0, y: 0, pointerDirection: 'down', pointerWidth: 500, pointerHeight: 200 }"
	}
];

const SVELTE_KONVA_COMPONENT_ACTION_LIST = COMPONENT_LIST.map((data) => {
	switch (data.componentName) {
		case 'Tag':
			data.importPath = `konva/lib/shapes/Label`;
			break;
		case 'Shape':
			data.importPath = `konva/lib/${data.componentName}`;
			break;
		default:
			data.importPath = `konva/lib/shapes/${data.componentName}`;
			break;
	}
	return {
		type: 'add',
		force: true,
		path: `src/lib/${data.componentName}.svelte`,
		data,
		templateFile: 'src/templates/svelteKonvaComponent.hbs'
	};
});

const SVELTE_KONVA_COMPONENT_TEST_ACTION_LIST = COMPONENT_LIST.filter(
	(data) => data.testConfig
).map((data) => {
	return {
		type: 'add',
		force: true,
		path: `src/tests/${data.componentName.toLowerCase()}.test.ts`,
		data,
		templateFile: 'src/templates/svelteKonvaComponentTests.hbs'
	};
});

export default function (plop) {
	plop.setGenerator('svelteKonvaComponents', {
		description: 'Creates all svelte-konva components that contain similar logic',
		prompts: [],
		actions: SVELTE_KONVA_COMPONENT_ACTION_LIST
	});

	plop.setGenerator('svelteKonvaComponentTests', {
		description: 'Creates all svelte-konva component tests that contain similar logic',
		prompts: [],
		actions: SVELTE_KONVA_COMPONENT_TEST_ACTION_LIST
	});
}
