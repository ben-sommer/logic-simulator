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

	ctx.fillStyle = "black";
	ctx.fillRect(100, 200, 50, 80);
};

export function setupCanvas(element: HTMLCanvasElement) {
	canvas = element;
	ctx = canvas.getContext("2d");

	onResize();
	window.addEventListener("resize", onResize);

	if (!ctx) return;

	draw();
	setupZoomAndPan(canvas, ctx, draw);
}
