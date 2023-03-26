const { styles } = await import(/* webpackIgnore: true */ "/shared/styling.js");

styles("#slider", {
	overflow: "visible",
	position: "initial"
});

styles("#slider > img", {
	width: "100vw",
	position: "initial"
});
