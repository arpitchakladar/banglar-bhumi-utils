import { OCRRequest, OCRResponse } from "@/shared/ocr-request";

const OFFSCREEN_DOCUMENT_PATH = "offscreen/ocr/index.html";

// Function to ensure the offscreen document is open
/**
 * Ensures the offscreen OCR document is open.  If it already exists
 * this is a no-op.
 */
async function setupOffscreenDocument(): Promise<void> {
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
/**
 * Listens for `"OCR"` messages from content scripts.  Forwards the
 * image data URL to an offscreen document for Tesseract.js processing
 * and sends the recognised text back to the caller.
 */
chrome.runtime.onMessage.addListener(function(message: OCRRequest, _sender, sendResponse): boolean {
	if (message.type === "OCR" && message.dataURL) {
		void (async function(): Promise<void> {
			try {
				// Ensure the offscreen document is open
				await setupOffscreenDocument();

				// Send the OCR request to the offscreen document
				const offscreenResponse = await chrome.runtime.sendMessage<OCRRequest, OCRResponse>({
					type: "OFFSCREEN_OCR_REQUEST",
					dataURL: message.dataURL
				});

				sendResponse(offscreenResponse);
			} catch(error) {
				sendResponse({ success: false, error: (error as Error).message });
			}
		})();
		return true; // Indicate async response
	}

	return false;
});
