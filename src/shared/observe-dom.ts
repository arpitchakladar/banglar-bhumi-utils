type ObserveDOMCallback = () => boolean;

let callbacks: (ObserveDOMCallback | null)[] = [];
let callbacksCalledCount = 0;

const observer = new MutationObserver(() => {
	for (let i = 0; i < callbacks.length; i++) {
		const callback = callbacks[i];
		if (callback && callback()) {
			callbacksCalledCount++;
			callbacks[i] = null;
		}

		if (callbacksCalledCount >= callbacks.length) {
			observer.disconnect();

			break;
		}
	}
});

observer.observe(document, {
	childList: true,
	subtree: true
});

export const observeDOM = (callback: ObserveDOMCallback) => {
	callbacks.push(callback);
};
