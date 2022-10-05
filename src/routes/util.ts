import type Konva from 'konva';

// Calculate real pointer position on canvas taking scale and stage position into account
// This is required if you scale or reposition your stage x/y coordinates
export function getRealPointerPos(pos: Konva.Vector2d, stage: Konva.Stage) {
	const realPos = {
		x: 0,
		y: 0
	};

	const stageScale = stage.scaleX(); // Only care about x scale as y is always the same

	realPos.x = pos.x / stageScale - stage.x() / stageScale;
	realPos.y = pos.y / stageScale - stage.y() / stageScale;

	return realPos;
}
