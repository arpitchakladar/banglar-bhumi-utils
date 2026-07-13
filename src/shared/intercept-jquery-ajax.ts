type InterceptJqueryAjaxCallback = (args: any) => void;

interface InterceptJqueryEntry {
	url: string;
	callback: InterceptJqueryAjaxCallback;
};

const postIntercepts: InterceptJqueryEntry[] = [];
const getIntercepts: InterceptJqueryEntry[] = [];

/**
 * On DOMContentLoaded, proxies jQuery's `$.post` and `$.get` so that
 * registered interceptors are called before the real request.
 */
document.addEventListener("DOMContentLoaded", () => {
	const proxiedPost = $.post;
	const proxiedGet = $.get;

	/** Proxied `$.post` that invokes registered interceptors before the real call. */
	$.post = function() {
		for (const { url, callback } of postIntercepts) {
			if (arguments[0].endsWith(url)) {
				callback(arguments);
			}
		}

		return proxiedPost.apply(this, Array.from(arguments) as any);
	};
	/** Proxied `$.get` that invokes registered interceptors before the real call. */
	$.get = function() {
		for (const { url, callback } of getIntercepts) {
			if (arguments[0].endsWith(url)) {
				callback(arguments);
			}
		}

		return proxiedGet.apply(this, Array.from(arguments) as any);
	};
});

/**
 * Registers a callback that fires whenever a jQuery POST request matches
 * the given URL suffix.
 *
 * @param url      - The URL suffix to match (checked via `endsWith`).
 * @param callback - Receives the original `arguments` from `$.post`.
 */
export function interceptPost(url: string, callback: InterceptJqueryAjaxCallback) {
	postIntercepts.push({ url, callback });
};

/**
 * Registers a callback that fires whenever a jQuery GET request matches
 * the given URL suffix.
 *
 * @param url      - The URL suffix to match (checked via `endsWith`).
 * @param callback - Receives the original `arguments` from `$.get`.
 */
export function interceptGet(url: string, callback: InterceptJqueryAjaxCallback) {
	getIntercepts.push({ url, callback });
};
