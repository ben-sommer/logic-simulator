let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

const onResize = () => {
	if (!canvas) return;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

export function setupCanvas(element: HTMLCanvasElement) {
	canvas = element;
	ctx = canvas.getContext("2d");

	onResize();
	window.addEventListener("resize", onResize);
}
