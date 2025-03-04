import { getGate } from "./images";
import { setupZoomAndPan } from "./zoomAndPan";

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

const onResize = () => {
	if (!canvas) return;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

const OR = await getGate("OR");

const draw = async () => {
	if (!ctx || !window.canvasState) return;

	const { canvasHeight, canvasWidth, scale, viewportTopLeft } =
		window.canvasState;

	const previousTransform = ctx.getTransform();

	const squareSize = 20;
	ctx.fillStyle = "blue";

	ctx?.drawImage(OR, 200, 200);

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
