const replace: (any[] | undefined)[] = [
	["head > script:nth-child(34)", { src: "" }],
	["head > script:nth-child(43)", { src: "" }]
];
let count = 0;

const observer = new MutationObserver(() => {
	for (let i = 0; i < replace.length; i++) {
		if (replace[i]) {
			const element = document.querySelector(replace[i]![0]) as HTMLElement | null;
			if (element) {
				const attributes = replace[i]![1];
				if (attributes.innerHTML) {
					element.innerHTML = attributes.innerHTML;
				}
				attributes.innerHTML = undefined;
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
