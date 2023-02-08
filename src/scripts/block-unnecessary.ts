let replace: (any[] | undefined)[] = [
	["head > script:nth-child(34)", { src: "" }],
	["head > script:nth-child(35)", { src: "https://code.jquery.com/jquery-1.12.4.min.js", crossorigin: "anonymous" }],
	["head > script:nth-child(43)", { src: "" }]
];
let count = 0;
let notDone = false;

const observer = new MutationObserver(() => {
	if (notDone) {
		const meta = document.querySelector("head > meta:nth-child(2)");
		if (meta) {
			meta.setAttribute("http-equiv", "Content-Security-Policy");
			meta.setAttribute("content", "default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *");
		}
	}
	for (let i = 0; i < replace.length; i++) {
		if (replace[i]) {
			const element = document.querySelector(replace[i]![0]) as HTMLElement | null;
			if (element) {
				const attributes = replace[i]![1];
				for (const attribute in attributes) {
					element.setAttribute(attribute, attributes[attribute]);
				}
				replace[i] = undefined;
				count++;
				if (count >= replace.length) {
					observer.disconnect();
					break;
				}
			}
		}
	}
});
observer.observe(document, {childList: true, subtree: true});
