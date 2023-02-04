import blockingReplacementCode from "@/scripts/stop-blocking/blocking-replacement-code.sjs";

const observer = new MutationObserver(mutations => {
	if (document.querySelector("head > script:nth-child(54)")) {
		document.querySelector("head > script:nth-child(54)")!.innerHTML = blockingReplacementCode;
		observer.disconnect();
	}
});
observer.observe(document, { childList: true, subtree: true });
