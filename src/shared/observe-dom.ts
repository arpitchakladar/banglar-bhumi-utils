type ObserveDOMCallback = () => boolean;

let callbacks: (ObserveDOMCallback | null)[] = [];
let count = 0;

const observer = new MutationObserver(() => {
	for (const callback of callbacks) {
		if (callback && callback()) {
			count++;
		}

		if (count >= callbacks.length) {
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
