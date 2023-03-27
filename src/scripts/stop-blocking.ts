const proxiedBind = $.prototype.bind;

$.prototype.bind = function() {
	if (arguments[0].trim() === "cut copy paste") {
		arguments[1] = (e: any) => {};
	}

	return proxiedBind.apply(this, Array.from(arguments) as any);
}

const proxiedKeydown = $.prototype.keydown;

$.prototype.keydown = function() {
	arguments[0] = (e: any) => true;

	return proxiedKeydown.apply(this, Array.from(arguments) as any);
}

document.addEventListener("DOMContentLoaded", () => {
	$.prototype.bind = proxiedBind;
	$.prototype.keydown = proxiedKeydown;
	document.oncontextmenu = new Function("return true") as any;
});
