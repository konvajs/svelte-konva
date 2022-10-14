/**
 * Code used to mock mouse movement and clicks on a Konva stage.
 *
 * Code taken from vue-konva (https://github.com/konvajs/vue-konva)
 *
 * MIT License
 *
 * Copyright (c) 2017-present Rafael Escala
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import Konva from 'konva';

export interface MockStage extends Konva.Stage {
	simulateMouseDown(this: Konva.Stage, pos: Konva.Vector2d): void;
	simulateMouseMove(this: Konva.Stage, pos: Konva.Vector2d): void;
	simulateMouseUp(this: Konva.Stage, pos: Konva.Vector2d): void;
}

interface KonvaMockStage extends Konva.Stage {
	prototype: {
		simulateMouseDown(this: Konva.Stage, pos: Konva.Vector2d): void;
		simulateMouseMove(this: Konva.Stage, pos: Konva.Vector2d): void;
		simulateMouseUp(this: Konva.Stage, pos: Konva.Vector2d): void;
	};
}

(Konva.Stage as unknown as KonvaMockStage).prototype.simulateMouseDown = function (
	pos: Konva.Vector2d
) {
	const top = this.content.getBoundingClientRect().top;

	// @ts-ignore
	this._pointerdown({
		clientX: pos.x,
		clientY: pos.y + top,
		type: 'mousedown'
	});
};

(Konva.Stage as unknown as KonvaMockStage).prototype.simulateMouseMove = function (pos) {
	const top = this.content.getBoundingClientRect().top;

	const evt = {
		clientX: pos.x,
		clientY: pos.y + top,
		type: 'mousemove'
	};

	// @ts-ignore
	this._pointermove(evt);
	Konva.DD._drag(evt);
};

(Konva.Stage as unknown as KonvaMockStage).prototype.simulateMouseUp = function (pos) {
	'use strict';
	const top = this.content.getBoundingClientRect().top;

	const evt = {
		clientX: pos.x,
		clientY: pos.y + top,
		type: 'mouseup'
	};
	Konva.DD._endDragBefore(evt);
	this._pointerup(evt);
	Konva.DD._endDragAfter(evt);
};
