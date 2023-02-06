type ConditionalString = string | undefined;
let scriptsToBlock: ConditionalString[] = [
	"head > script:nth-child(34)",
	"head > script:nth-child(43)"
];
let count = 0;

const observer = new MutationObserver(mutations => {
	for (let i = 0; i < scriptsToBlock.length; i++) {
		if (scriptsToBlock[i]) {
			const script = document.querySelector(scriptsToBlock[i]!) as HTMLScriptElement;
			if (script) {
				script.src = "";
				count++;
				scriptsToBlock[i] = undefined;
				if (count >= scriptsToBlock.length) {
					observer.disconnect();
					break;
				}
			}
		}
	}
});
observer.observe(document, {childList: true, subtree: true});
