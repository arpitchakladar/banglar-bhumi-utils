export const observeDOM = (callback: () => boolean, element: HTMLElement = document as unknown as HTMLElement) => {
	const observer = new MutationObserver(() => {
		if (callback()) {
			observer.disconnect();
		}
	});

	observer.observe(element, {
		childList: true,
		subtree: true
	});
};
