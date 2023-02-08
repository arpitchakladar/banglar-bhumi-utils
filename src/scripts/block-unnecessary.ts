type ConditionalString = string | undefined;
let blocked: ConditionalString[] = [
	"head > script:nth-child(34)",
	"head > script:nth-child(43)"
];
let count = 0;

const observer = new MutationObserver(mutations => {
	for (let i = 0; i < blocked.length; i++) {
		if (blocked[i]) {
			const element = document.querySelector(blocked[i]!) as HTMLElement | null;
			if (element) {
				if (element instanceof HTMLScriptElement) {
					element.src = "";
				} else if (element instanceof HTMLLinkElement && element.getAttribute("rel") === "stylesheet") {
					element.href = "";
				}
				blocked[i] = undefined;
				count++;
				if (count >= blocked.length) {
					observer.disconnect();
					break;
				}
			}
		}
	}
});
observer.observe(document, {childList: true, subtree: true});
