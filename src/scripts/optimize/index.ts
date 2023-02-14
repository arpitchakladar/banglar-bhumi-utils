import { modifyDOM, DOMModifier } from "@/utils/modify-dom";

modifyDOM([
	new DOMModifier("head > script:nth-child(34)", { src: null }),
	new DOMModifier("head > script:nth-child(36)", { src: null, innerHTML: "$.prototype.nivoSlider = () => {};" }),
	new DOMModifier("head > script:nth-child(43)", { src: null })
]);
