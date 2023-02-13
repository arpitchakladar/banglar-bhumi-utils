import observeDOM from "@/utils/observe-dom";

const replace: (any[] | undefined)[] = [
	["head > script:nth-child(34)", { src: "" }],
	["head > script:nth-child(43)", { src: "" }]
];
let count = 0;

observeDOM(() => {
	for (let i = 0; i < replace.length; i++) {
		if (replace[i]) {
			const element = document.querySelector(replace[i]![0]) as HTMLElement | null;
			if (element) {
				const attributes = replace[i]![1];
				if (attributes.innerHTML) {
					element.innerHTML = attributes.innerHTML;
				}
				delete attributes.innerHTML;
				for (const attribute in attributes) {
					element.setAttribute(attribute, attributes[attribute]);
				}
				replace[i] = undefined;
				count++;
				if (count >= replace.length) {
					return true;
				}
			}
		}
	}

	return false;
});
