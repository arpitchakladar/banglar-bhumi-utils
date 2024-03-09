export const injectScriptHead = (src: string) => {
	const s = document.createElement("script") as HTMLScriptElement;
	s.src = chrome.runtime.getURL(src);
	// s.onload = () => s.remove();
	(document.head || document.documentElement).append(s);
};
