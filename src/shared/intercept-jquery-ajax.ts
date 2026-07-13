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

// Define a strict signature to replace the unsafe `Function` type
type OriginalJQueryAjaxMethod = (...args: unknown[]) => JQuery.jqXHR;

/**
 * On DOMContentLoaded, proxies jQuery's `$.post` and `$.get` so that
 * registered interceptors are called before the real request.
 */
document.addEventListener("DOMContentLoaded", function() {
	// 1. Keep the original methods bound to the jQuery ($) object
	const originalPost = $.post.bind($);
	const originalGet = $.get.bind($);

	/** Proxied `$.post` that invokes registered interceptors before the real call. */
	$.post = function(this: typeof $, ...args: unknown[]): JQuery.jqXHR {
		for (const { urlSuffix, interceptor } of postInterceptors) {
			// Safely inspect jQuery settings objects without using "any"
			const firstArg = args[0];
			const requestUrl = typeof firstArg === "string"
				? firstArg
				: (firstArg && typeof firstArg === "object" && "url" in firstArg && typeof firstArg.url === "string" ? firstArg.url : null);

			if (typeof requestUrl === "string" && requestUrl.endsWith(urlSuffix)) {
				// Cast the unknown array to the expected tuple type
				interceptor(args as unknown as JQueryAjaxArgs);
			}
		}

		// Use our strict signature instead of `Function` to satisfy ESLint
		return (originalPost as unknown as OriginalJQueryAjaxMethod)(...args);
	} as typeof $.post; // Reassert the original type so external consumers see the normal signature

	/** Proxied `$.get` that invokes registered interceptors before the real call. */
	$.get = function(this: typeof $, ...args: unknown[]): JQuery.jqXHR {
		for (const { urlSuffix, interceptor } of getInterceptors) {
			const firstArg = args[0];
			const requestUrl = typeof firstArg === "string"
				? firstArg
				: (firstArg && typeof firstArg === "object" && "url" in firstArg && typeof firstArg.url === "string" ? firstArg.url : null);

			if (typeof requestUrl === "string" && requestUrl.endsWith(urlSuffix)) {
				interceptor(args as unknown as JQueryAjaxArgs);
			}
		}

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
