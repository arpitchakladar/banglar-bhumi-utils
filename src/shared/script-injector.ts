type DataType = {
	[key: string]: string
};

export function injectScriptHead(src: string, data: DataType = {}) {
	const s = document.createElement("script") as HTMLScriptElement;
	s.src = chrome.runtime.getURL(src);
	for (const i in data) {
		s.setAttribute(`data-${i}`, data[i]);
	}
	(document.head || document.documentElement).append(s);
};
