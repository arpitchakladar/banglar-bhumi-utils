export const observeDOM = (callback: () => boolean) => {
	const observer = new MutationObserver(() => {
		if (callback()) {
			observer.disconnect();
		}
	});
	observer.observe(document, {childList: true, subtree: true});
};
