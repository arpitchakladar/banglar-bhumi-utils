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
export type JQueryAjaxResponse = {
	data: unknown;
	textStatus?: string
};

/**
 * A responder inspects the outgoing args and optionally returns a response.
 * Returning `undefined` means "not handled, let the real request (or the next
 * responder) proceed."
 */
type JQueryAjaxResponder = (args: JQueryAjaxArgs) => JQueryAjaxResponse | undefined | null;

type ResponderRegistration = {
	urlSuffix: string;
	responder: JQueryAjaxResponder
};
const postResponders: ResponderRegistration[] = [];
const getResponders: ResponderRegistration[] = [];

/** The finalized outcome of a request, whether it came from the network (success or failure) or a responder. */
export type JQueryAjaxResult = {
	data: unknown;
	textStatus: string;
	jqXHR: JQuery.jqXHR
};

/**
 * A listener fires once a request settles — on success or failure alike —
 * and always receives whatever response data is available. Unlike
 * interceptors (which see the outgoing request) and responders (which can
 * short-circuit it), listeners only observe the final result.
 */
type JQueryAjaxListener = (args: JQueryAjaxArgs, result: JQueryAjaxResult) => void;

type ListenerRegistration = {
	urlSuffix: string;
	listener: JQueryAjaxListener;
	/** Whether a responder-short-circuited response should also trigger this listener. */
	includeResponderResponses: boolean
};
const postListeners: ListenerRegistration[] = [];
const getListeners: ListenerRegistration[] = [];

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
 * Invokes any registered listeners whose `urlSuffix` matches the request URL.
 * `fromResponder` indicates whether this result came from a short-circuited
 * responder rather than a genuine network response, so listeners registered
 * with `includeResponderResponses: false` can be skipped.
 */
function runListeners(
	listeners: ListenerRegistration[],
	args: unknown[],
	result: JQueryAjaxResult,
	fromResponder: boolean
): void {
	const requestUrl = extractUrl(args);
	if (typeof requestUrl !== "string") return;

	for (const { urlSuffix, listener, includeResponderResponses } of listeners) {
		if (!requestUrl.endsWith(urlSuffix)) continue;
		if (fromResponder && !includeResponderResponses) continue;
		listener(args as unknown as JQueryAjaxArgs, result);
	}
}

/**
 * Checks registered responders for a match. If one matches and returns a
 * response, synthesizes a resolved jqXHR-like object, invokes the caller's
 * own success callback (3rd positional arg) to preserve `$.post`/`$.get`
 * shorthand semantics, fires any matching listeners, and returns the jqXHR
 * so the real ajax call can be skipped. Returns `null` if no responder
 * handled the request.
 */
function tryRespond(
	responders: ResponderRegistration[],
	listeners: ListenerRegistration[],
	args: unknown[]
): JQuery.jqXHR | null {
	const requestUrl = extractUrl(args);
	if (typeof requestUrl !== "string") return null;

	for (const { urlSuffix, responder } of responders) {
		if (!requestUrl.endsWith(urlSuffix)) continue;

		const response = responder(args as unknown as JQueryAjaxArgs);
		if (!response) continue;

		const { data, textStatus = "success" } = response;
		const deferred = $.Deferred();
		const jqXHR = deferred.promise() as unknown as JQuery.jqXHR;

		const callback = args[2];
		if (typeof callback === "function") {
			(callback as JQueryAjaxArgs[2])(data, textStatus, jqXHR);
		}
		deferred.resolve(data, textStatus, jqXHR);

		runListeners(listeners, args, { data, textStatus, jqXHR }, /* fromResponder */ true);

		return jqXHR;
	}
	return null;
}

/**
 * On DOMContentLoaded, proxies jQuery's `$.post` and `$.get` so that
 * registered interceptors are called before the real request, registered
 * responders get a chance to short-circuit the request entirely by
 * resolving it with synthetic data, and registered listeners are notified
 * once the request settles (whether real or synthesized, success or
 * failure).
 */
document.addEventListener("DOMContentLoaded", function() {
	// 1. Keep the original methods bound to the jQuery ($) object
	const originalPost = $.post.bind($);
	const originalGet = $.get.bind($);

	/**
	 * Proxied `$.post` that invokes registered interceptors before the real
	 * call, checks registered responders for a short-circuit, and otherwise
	 * falls back to the real `$.post`, notifying listeners once the request
	 * settles either way.
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

		const shortCircuited = tryRespond(postResponders, postListeners, args);
		if (shortCircuited) return shortCircuited;

		// Use our strict signature instead of `Function` to satisfy ESLint
		const jqXHR = (originalPost as unknown as OriginalJQueryAjaxMethod)(...args);
		jqXHR.done((data: unknown, textStatus: string, doneJqXHR: JQuery.jqXHR) => {
			runListeners(postListeners, args, { data, textStatus, jqXHR: doneJqXHR }, /* fromResponder */ false);
		});
		jqXHR.fail((failJqXHR: JQuery.jqXHR, textStatus: string) => {
			runListeners(
				postListeners,
				args,
				{ data: failJqXHR.responseJSON ?? failJqXHR.responseText, textStatus, jqXHR: failJqXHR },
				/* fromResponder */ false
			);
		});
		return jqXHR;
	} as typeof $.post; // Reassert the original type so external consumers see the normal signature

	/**
	 * Proxied `$.get` that invokes registered interceptors before the real
	 * call, checks registered responders for a short-circuit, and otherwise
	 * falls back to the real `$.get`, notifying listeners once the request
	 * settles either way.
	 */
	$.get = function(this: typeof $, ...args: unknown[]): JQuery.jqXHR {
		for (const { urlSuffix, interceptor } of getInterceptors) {
			const requestUrl = extractUrl(args);
			if (typeof requestUrl === "string" && requestUrl.endsWith(urlSuffix)) {
				interceptor(args as unknown as JQueryAjaxArgs);
			}
		}

		const shortCircuited = tryRespond(getResponders, getListeners, args);
		if (shortCircuited) return shortCircuited;

		const jqXHR = (originalGet as unknown as OriginalJQueryAjaxMethod)(...args);
		jqXHR.done((data: unknown, textStatus: string, doneJqXHR: JQuery.jqXHR) => {
			runListeners(getListeners, args, { data, textStatus, jqXHR: doneJqXHR }, /* fromResponder */ false);
		});
		jqXHR.fail((failJqXHR: JQuery.jqXHR, textStatus: string) => {
			runListeners(
				getListeners,
				args,
				{ data: failJqXHR.responseJSON ?? failJqXHR.responseText, textStatus, jqXHR: failJqXHR },
				/* fromResponder */ false
			);
		});
		return jqXHR;
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

/**
 * Registers a listener that fires once a matching `$.post` request settles
 * — success or failure alike — receiving the original request args plus
 * whatever response data, `textStatus`, and `jqXHR` are available.
 *
 * @param urlSuffix                  - The URL suffix to match (checked via `endsWith`).
 * @param listener                   - Receives the original `arguments` from `$.post`
 *                                      plus the result.
 * @param includeResponderResponses  - Whether a responder-short-circuited response
 *                                      should also trigger this listener, as opposed
 *                                      to only genuine network responses. Defaults to `true`.
 */
export function addPostListener(
	urlSuffix: string,
	listener: JQueryAjaxListener,
	includeResponderResponses = true
): void {
	postListeners.push({ urlSuffix, listener, includeResponderResponses });
}

/**
 * Registers a listener that fires once a matching `$.get` request settles
 * — success or failure alike — receiving the original request args plus
 * whatever response data, `textStatus`, and `jqXHR` are available.
 *
 * @param urlSuffix                  - The URL suffix to match (checked via `endsWith`).
 * @param listener                   - Receives the original `arguments` from `$.get`
 *                                      plus the result.
 * @param includeResponderResponses  - Whether a responder-short-circuited response
 *                                      should also trigger this listener, as opposed
 *                                      to only genuine network responses. Defaults to `true`.
 */
export function addGetListener(
	urlSuffix: string,
	listener: JQueryAjaxListener,
	includeResponderResponses = true
): void {
	getListeners.push({ urlSuffix, listener, includeResponderResponses });
}
