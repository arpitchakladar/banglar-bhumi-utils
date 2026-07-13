/**
 * Proxies jQuery's `.bind()` (for the `"cut copy paste"` event) and
 * `.keydown()` so that the website's copy/paste/right-click blocking
 * is disabled.  Reverts the prototypes after patching to avoid
 * interfering with other code.
 */
document.addEventListener("DOMContentLoaded", () => {
	const proxiedBind = $.prototype.bind;
	/** Proxies jQuery `.bind()` to no-op the `"cut copy paste"` event. */
	$.prototype.bind = function() {
		if (arguments[0].trim() === "cut copy paste") {
			arguments[1] = (_: any) => {};
		}

		return proxiedBind.apply(this, Array.from(arguments) as any);
	}

	const proxiedKeydown = $.prototype.keydown;
	/** Proxies jQuery `.keydown()` so all key presses are allowed. */
	$.prototype.keydown = function() {
		arguments[0] = (_: any) => true;

		return proxiedKeydown.apply(this, Array.from(arguments) as any);
	}

	$.prototype.bind = proxiedBind;
	$.prototype.keydown = proxiedKeydown;
	document.oncontextmenu = () => true;
});
