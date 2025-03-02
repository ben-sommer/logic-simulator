import { setupZoomAndPan } from "./zoomAndPan";

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

const onResize = () => {
	if (!canvas) return;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

const draw = () => {
	if (!ctx || !window.canvasState) return;

	const { canvasHeight, canvasWidth, scale, viewportTopLeft } =
		window.canvasState;

	const previousTransform = ctx.getTransform();

	ctx.clearRect(0, 0, 1000, 1000);

	const squareSize = 20;
	ctx.fillStyle = "blue";
	ctx.fillRect(
		canvasWidth / 2 - squareSize / 2,
		canvasHeight / 2 - squareSize / 2,
		squareSize,
		squareSize
	);
	ctx.arc(viewportTopLeft.x, viewportTopLeft.y, 25 / scale, 0, 2 * Math.PI);
	ctx.fillStyle = "red";
	ctx.fill();

	ctx.setTransform(previousTransform);
};

const drawLoop = () => {
	draw();
	window.requestAnimationFrame(drawLoop);
};

export function setupCanvas(element: HTMLCanvasElement) {
	canvas = element;
	ctx = canvas.getContext("2d");

	onResize();
	window.addEventListener("resize", onResize);

	if (!ctx) return;

	drawLoop();
	setupZoomAndPan(canvas, ctx, () => window.requestAnimationFrame(draw));
}
