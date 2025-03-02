import "./style.css";
import { setupCanvas } from "./canvas.ts";

const canvas = document.createElement("canvas");

document.querySelector<HTMLDivElement>("#app")?.appendChild(canvas);

setupCanvas(canvas);
