import { setupZoomAndPan } from "./zoomAndPan";

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

const onResize = () => {
	if (!canvas) return;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

const draw = () => {
	if (!ctx) return;

	const previousTransform = ctx.getTransform();

	ctx.clearRect(0, 0, 1000, 1000);

	const width = 100;
	const height = 50;
	const x = 100;
	const y = 200;

	ctx.fillStyle = "lightblue";
	ctx.fillRect(x, y, width, height);

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
