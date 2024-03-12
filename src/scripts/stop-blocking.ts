document.addEventListener("DOMContentLoaded", () => {
	const proxiedBind = $.prototype.bind;
	$.prototype.bind = function() {
		if (arguments[0].trim() === "cut copy paste") {
			arguments[1] = (_: any) => {};
		}

		return proxiedBind.apply(this, Array.from(arguments) as any);
	}

	const proxiedKeydown = $.prototype.keydown;
	$.prototype.keydown = function() {
		arguments[0] = (_: any) => true;

		return proxiedKeydown.apply(this, Array.from(arguments) as any);
	}

	$.prototype.bind = proxiedBind;
	$.prototype.keydown = proxiedKeydown;
	document.oncontextmenu = () => true;
});
