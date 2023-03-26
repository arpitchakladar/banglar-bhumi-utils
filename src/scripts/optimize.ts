const { modifyDOM } = await import(/* webpackIgnore: true */ "/shared/modify-dom.js");

modifyDOM([
	["head > script:nth-child(34)", { src: null }],
	["head > script:nth-child(36)", { src: null, innerHTML: "$.prototype.nivoSlider = () => {};" }],
	["head > script:nth-child(43)", { src: null }]
]);
