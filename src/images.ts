import { Gate } from "./types";

const getGateImageUrl = (name: Gate) => {
	// note that this does not include files in subdirectories
	return new URL(`./assets/gates/${name}.png`, import.meta.url).href;
};

let cache: {
	[name: string]: HTMLImageElement;
} = {};

export const getGate = (name: Gate): Promise<HTMLImageElement> =>
	new Promise((resolve) => {
		const cached = cache[name];

		if (cached) {
			return resolve(cached);
		}

		const image = new Image();
		image.src = getGateImageUrl(name);
		image.onload = () => {
			return resolve(image);
		};
	});
