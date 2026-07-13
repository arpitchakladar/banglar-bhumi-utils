type ObserveDOMCallback = () => boolean;

let callbacks: ObserveDOMCallback[] = [];

/**
 * Starts a MutationObserver on the document that invokes each
 * registered callback.  A callback should return `true` when it
 * has completed its work; once all callbacks are done the observer
 * disconnects.
 */
const observer = new MutationObserver(() => {
	for (let i = 0; i < callbacks.length; i++) {
		const callback = callbacks[i];
		if (callback && callback()) {
			callbacks.splice(i, 1);
		}

		if (callbacks.length <= 0) {
			observer.disconnect();

			break;
		}
	}
});

observer.observe(document, {
	childList: true,
	subtree: true
});

/**
 * Registers a callback to run on DOM mutations.
 * The callback is invoked on each mutation tick and should return `true`
 * when its work is finished.  When all callbacks have completed the
 * observer stops.
 *
 * @param callback - Function that returns `true` when done.
 */
export function observeDOM(callback: ObserveDOMCallback) {
	callbacks.push(callback);
};
