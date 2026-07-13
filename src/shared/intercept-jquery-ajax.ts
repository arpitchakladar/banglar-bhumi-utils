export type JQueryAjaxArgs = [
	url: string,
	data: string | Record<string, unknown>,
	callback: (data: unknown, textStatus: string, jqXHR: JQuery.jqXHR) => void,
	dataType?: string
];
type JQueryAjaxInterceptor = (args: JQueryAjaxArgs) => void;
type InterceptorRegistration = {
	urlSuffix: string;
	interceptor: JQueryAjaxInterceptor
};
const postInterceptors: InterceptorRegistration[] = [];
const getInterceptors: InterceptorRegistration[] = [];

/** Data a responder wants to resolve the "request" with, instead of hitting the network. */
type JQueryAjaxResponse = {
	data: unknown;
	textStatus?: string
};

/**
 * A responder inspects the outgoing args and optionally returns a response.
 * Returning `undefined` means "not handled, let the real request (or the next
 * responder) proceed."
 */
type JQueryAjaxResponder = (args: JQueryAjaxArgs) => JQueryAjaxResponse | undefined;

type ResponderRegistration = {
	urlSuffix: string;
	responder: JQueryAjaxResponder
};
const postResponders: ResponderRegistration[] = [];
const getResponders: ResponderRegistration[] = [];

// Define a strict signature to replace the unsafe `Function` type
type OriginalJQueryAjaxMethod = (...args: unknown[]) => JQuery.jqXHR;

/**
 * Extracts the request URL from `$.post`/`$.get` args, whether called with a
 * plain string URL or a settings object.
 */
function extractUrl(args: unknown[]): string | null {
	const firstArg = args[0];
	if (typeof firstArg === "string") return firstArg;
	if (firstArg && typeof firstArg === "object" && "url" in firstArg && typeof firstArg.url === "string") {
		return firstArg.url;
	}
	return null;
}

/**
 * Checks registered responders for a match. If one matches and returns a
 * response, synthesizes a resolved jqXHR-like object, invokes the caller's
 * own success callback (3rd positional arg) to preserve `$.post`/`$.get`
 * shorthand semantics, and returns it so the real ajax call can be skipped.
 * Returns `null` if no responder handled the request.
 */
function tryRespond(responders: ResponderRegistration[], args: unknown[]): JQuery.jqXHR | null {
	const requestUrl = extractUrl(args);
	if (typeof requestUrl !== "string") return null;

	for (const { urlSuffix, responder } of responders) {
		if (!requestUrl.endsWith(urlSuffix)) continue;

		const response = responder(args as unknown as JQueryAjaxArgs);
		if (response === undefined) continue;

		const { data, textStatus = "success" } = response;
		const deferred = $.Deferred();
		const jqXHR = deferred.promise() as unknown as JQuery.jqXHR;

		const callback = args[2];
		if (typeof callback === "function") {
			(callback as JQueryAjaxArgs[2])(data, textStatus, jqXHR);
		}
		deferred.resolve(data, textStatus, jqXHR);

		return jqXHR;
	}
	return null;
}

/**
 * On DOMContentLoaded, proxies jQuery's `$.post` and `$.get` so that
 * registered interceptors are called before the real request, and
 * registered responders get a chance to short-circuit the request entirely
 * by resolving it with synthetic data.
 */
document.addEventListener("DOMContentLoaded", function() {
	// 1. Keep the original methods bound to the jQuery ($) object
	const originalPost = $.post.bind($);
	const originalGet = $.get.bind($);

	/**
	 * Proxied `$.post` that invokes registered interceptors before the real
	 * call, then checks registered responders for a short-circuit before
	 * falling back to the real `$.post`.
	 */
	$.post = function(this: typeof $, ...args: unknown[]): JQuery.jqXHR {
		for (const { urlSuffix, interceptor } of postInterceptors) {
			// Safely inspect jQuery settings objects without using "any"
			const requestUrl = extractUrl(args);
			if (typeof requestUrl === "string" && requestUrl.endsWith(urlSuffix)) {
				// Cast the unknown array to the expected tuple type
				interceptor(args as unknown as JQueryAjaxArgs);
			}
		}

		const shortCircuited = tryRespond(postResponders, args);
		if (shortCircuited) return shortCircuited;

		// Use our strict signature instead of `Function` to satisfy ESLint
		return (originalPost as unknown as OriginalJQueryAjaxMethod)(...args);
	} as typeof $.post; // Reassert the original type so external consumers see the normal signature

	/**
	 * Proxied `$.get` that invokes registered interceptors before the real
	 * call, then checks registered responders for a short-circuit before
	 * falling back to the real `$.get`.
	 */
	$.get = function(this: typeof $, ...args: unknown[]): JQuery.jqXHR {
		for (const { urlSuffix, interceptor } of getInterceptors) {
			const requestUrl = extractUrl(args);
			if (typeof requestUrl === "string" && requestUrl.endsWith(urlSuffix)) {
				interceptor(args as unknown as JQueryAjaxArgs);
			}
		}

		const shortCircuited = tryRespond(getResponders, args);
		if (shortCircuited) return shortCircuited;

		return (originalGet as unknown as OriginalJQueryAjaxMethod)(...args);
	} as typeof $.get;
});

/**
 * Registers a callback that fires whenever a jQuery POST request matches
 * the given URL suffix.
 *
 * @param urlSuffix   - The URL suffix to match (checked via `endsWith`).
 * @param interceptor - Receives the original `arguments` from `$.post`.
 */
export function addPostInterceptor(urlSuffix: string, interceptor: JQueryAjaxInterceptor): void {
	postInterceptors.push({ urlSuffix, interceptor });
}

/**
 * Registers a callback that fires whenever a jQuery GET request matches
 * the given URL suffix.
 *
 * @param urlSuffix   - The URL suffix to match (checked via `endsWith`).
 * @param interceptor - Receives the original `arguments` from `$.get`.
 */
export function addGetInterceptor(urlSuffix: string, interceptor: JQueryAjaxInterceptor): void {
	getInterceptors.push({ urlSuffix, interceptor });
}

/**
 * Registers a responder that can conditionally short-circuit a matching
 * `$.post` call, resolving it with synthetic data instead of making the
 * real network request.
 *
 * @param urlSuffix - The URL suffix to match (checked via `endsWith`).
 * @param responder - Inspects the original `arguments` from `$.post` and
 *                     either returns a `{ data, textStatus? }` response to
 *                     short-circuit the request, or `undefined` to let the
 *                     request proceed (checking the next responder, or
 *                     falling through to the real `$.post`).
 */
export function addPostResponder(urlSuffix: string, responder: JQueryAjaxResponder): void {
	postResponders.push({ urlSuffix, responder });
}

/**
 * Registers a responder that can conditionally short-circuit a matching
 * `$.get` call, resolving it with synthetic data instead of making the
 * real network request.
 *
 * @param urlSuffix - The URL suffix to match (checked via `endsWith`).
 * @param responder - Inspects the original `arguments` from `$.get` and
 *                     either returns a `{ data, textStatus? }` response to
 *                     short-circuit the request, or `undefined` to let the
 *                     request proceed (checking the next responder, or
 *                     falling through to the real `$.get`).
 */
export function addGetResponder(urlSuffix: string, responder: JQueryAjaxResponder): void {
	getResponders.push({ urlSuffix, responder });
}
