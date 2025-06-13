const OFFSCREEN_DOCUMENT_PATH = "offscreen/ocr/index.html";

// Function to ensure the offscreen document is open
async function setupOffscreenDocument() {
	if (await chrome.offscreen.hasDocument()) {
		return; // Offscreen document already open
	}
	await chrome.offscreen.createDocument({
		url: OFFSCREEN_DOCUMENT_PATH,
		reasons: [chrome.offscreen.Reason.CLIPBOARD],
		justification: "Performing OCR with Tesseract.js in a long-running context."
	});
}

// Listen for messages from content scripts (and popup if applicable)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "OCR" && message.dataURL) {
		(async () => {
			try {
				// Ensure the offscreen document is open
				await setupOffscreenDocument();

				// Send the OCR request to the offscreen document
				const offscreenResponse = await chrome.runtime.sendMessage({
					type: "OFFSCREEN_OCR_REQUEST",
					dataURL: message.dataURL
				});

				if (offscreenResponse && offscreenResponse.success) {
					sendResponse(offscreenResponse);
				} else {
					sendResponse({ success: false, error: offscreenResponse?.error || "Unknown OCR error" });
				}
			} catch (error) {
				sendResponse({ success: false, error: (error as Error).message });
			}
		})();
		return true; // Indicate async response
	}

	return false;
});
