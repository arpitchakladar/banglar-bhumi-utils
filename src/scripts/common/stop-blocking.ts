/**
 * Proxies jQuery's `.bind()` (for the `"cut copy paste"` event) and
 * `.keydown()` so that the website's copy/paste/right-click blocking
 * is disabled.  Reverts the prototypes after patching to avoid
 * interfering with other code.
 */

type JQueryBindFn = (
	eventName: string,
	handler: (event: JQuery.Event) => unknown
) => JQuery;

type JQueryKeydownFn = (
	handler: (event: JQuery.Event) => unknown
) => JQuery;

type JQueryPrototypeShape = {
	bind: JQueryBindFn;
	keydown: JQueryKeydownFn
};

const jQueryPrototype = $.prototype as unknown as JQueryPrototypeShape;

document.addEventListener("DOMContentLoaded", () => {
	const proxiedBind = jQueryPrototype.bind;
	/** Proxies jQuery `.bind()` to no-op the `"cut copy paste"` event. */
	jQueryPrototype.bind = function(
		this: JQuery,
		...args: Parameters<JQueryBindFn>
	): JQuery {
		const [eventName, handler] = args;
		const noop = (): undefined => undefined;
		return proxiedBind.call(
			this,
			eventName,
			eventName.trim() === "cut copy paste" ? noop : handler
		);
	};

	const proxiedKeydown = jQueryPrototype.keydown;
	/** Proxies jQuery `.keydown()` so all key presses are allowed. */
	jQueryPrototype.keydown = function(
		this: JQuery,
		..._args: Parameters<JQueryKeydownFn>
	): JQuery {
		return proxiedKeydown.call(this, () => true);
	};

	jQueryPrototype.bind = proxiedBind;
	jQueryPrototype.keydown = proxiedKeydown;
	document.oncontextmenu = (): boolean => true;
});
