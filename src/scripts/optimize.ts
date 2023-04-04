import { modifyDOM } from "@/shared/modify-dom";

modifyDOM([
	[
		"head > script:nth-child(36)",
		{
			src: null,
			innerHTML: "$.prototype.nivoSlider = () => {};"
		}
	]
]);
