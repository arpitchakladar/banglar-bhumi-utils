import { modifyDOM } from "@/utils/modify-dom";

modifyDOM([
	["head > script:nth-child(34)", { src: null }],
	["head > script:nth-child(36)", { src: null, innerHTML: "$.prototype.nivoSlider = () => {};" }],
	["head > script:nth-child(43)", { src: null }]
]);
