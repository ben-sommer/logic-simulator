// Only allow zooming out
const MIN_ZOOM = 0;
const MAX_ZOOM = 1;

const ZOOM_SENSITIVITY = 500;

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let draw: (() => void) | null = null;

declare global {
	interface Window {
		canvasState?: {
			canvasWidth: number;
			canvasHeight: number;
			viewportTopLeft: Point;
			scale: number;
		};
	}
}

type Point = {
	x: number;
	y: number;
};

const ORIGIN = Object.freeze({ x: 0, y: 0 });

function diffPoints(p1: Point, p2: Point) {
	return { x: p1.x - p2.x, y: p1.y - p2.y };
}

function addPoints(p1: Point, p2: Point) {
	return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function scalePoint(p1: Point, scale: number) {
	return { x: p1.x / scale, y: p1.y / scale };
}

let scale = 1;
let offset: Point = ORIGIN;
let mousePos: Point = ORIGIN;
let viewportTopLeft: Point = ORIGIN;
let lastMousePos: Point = ORIGIN;
let lastOffset: Point = ORIGIN;
let canvasWidth = 0;
let canvasHeight = 0;

const reset = () => {
	if (!canvas || !ctx) return;

	ctx.canvas.width = canvasWidth;
	ctx.canvas.height = canvasHeight;
	ctx.scale(1, 1);
	scale = 1;

	mousePos = ORIGIN;
	viewportTopLeft = ORIGIN;
	lastMousePos = ORIGIN;
	lastOffset = ORIGIN;

	applyTransform();
	applyPan();
};

const onMouseMove = (event: MouseEvent) => {
	const currentMousePos = {
		x: event.pageX,
		y: event.pageY,
	};

	const mouseDiff = diffPoints(currentMousePos, lastMousePos);
	offset = addPoints(offset, mouseDiff);
	applyTransform();
	applyPan();
	lastMousePos = currentMousePos;

	drawFrame();
};

const onMouseUp = () => {
	document.removeEventListener("mousemove", onMouseMove);
	document.removeEventListener("mouseup", onMouseUp);
};

const startPan = (event: MouseEvent) => {
	document.addEventListener("mousemove", onMouseMove);
	document.addEventListener("mouseup", onMouseUp);
	lastMousePos = { x: event.pageX, y: event.pageY };
};

const applyPan = () => {
	if (!ctx) return;

	const offsetDiff = scalePoint(diffPoints(offset, lastOffset), scale);

	ctx.translate(offsetDiff.x, offsetDiff.y);
	viewportTopLeft = diffPoints(viewportTopLeft, offsetDiff);
	lastOffset = offset;
};

const applyTransform = () => {
	if (!ctx) return;

	const storedTransform = ctx.getTransform();
	ctx.canvas.width = ctx.canvas.width;
	ctx.setTransform(storedTransform);
};

const onMouseUpdate = (event: MouseEvent) => {
	if (!canvas) return;

	const viewportMousePos = {
		x: event.clientX,
		y: event.clientY,
	};
	const topLeftCanvasPos = {
		x: canvas.offsetLeft,
		y: canvas.offsetTop,
	};

	mousePos = diffPoints(viewportMousePos, topLeftCanvasPos);
};

const applyZoom = (event: WheelEvent) => {
	if (!ctx) return;

	let zoom = 1 - event.deltaY / ZOOM_SENSITIVITY;
	const viewportTopLeftDelta = {
		x: (mousePos.x / scale) * (1 - 1 / zoom),
		y: (mousePos.y / scale) * (1 - 1 / zoom),
	};
	const newViewportTopLeft = addPoints(viewportTopLeft, viewportTopLeftDelta);

	if (scale * zoom < MIN_ZOOM && zoom < 1) {
		return;
	}

	if (scale * zoom > MAX_ZOOM && zoom > 1) {
		return;
	}

	ctx.translate(viewportTopLeft.x, viewportTopLeft.y);
	ctx.scale(zoom, zoom);
	ctx.translate(-newViewportTopLeft.x, -newViewportTopLeft.y);

	viewportTopLeft = newViewportTopLeft;
	scale *= zoom;

	applyPan();
	applyTransform();

	drawFrame();
};

const onResize = () => {
	reset();
	applyTransform();
};

const onWheel = (event: WheelEvent) => {
	onMouseUpdate(event);
	applyZoom(event);
};

const drawFrame = () => {
	if (!draw) return;

	window.canvasState = {
		canvasHeight,
		canvasWidth,
		viewportTopLeft,
		scale,
	};
};

export const setupZoomAndPan = (
	element: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
	drawFunction: () => void
) => {
	canvas = element;
	ctx = context;
	draw = drawFunction;
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;

	drawFrame();

	document.addEventListener("resize", onResize);
	document.addEventListener("mousemove", onMouseUpdate);
	document.addEventListener("wheel", onWheel);
	document.addEventListener("mousedown", startPan);
};
