import Tesseract from "./static/tesseract.esm.min.js";

let ocrWorker = null;
const WORKER_PATH = chrome.runtime.getURL("offscreen/ocr/static/worker.min.js");
const CORE_PATH = chrome.runtime.getURL("offscreen/ocr/static");

/**
 * Creates (or reuses) a Tesseract.js worker and recognises text from
 * the given image data URL.  The worker is configured to only recognise
 * uppercase alphanumerics (excluding `0`, `O`, `1`, `I`) suitable for
 * CAPTCHA text.
 *
 * @param {string} dataURL - A `data:image/png;base64,…` string.
 * @returns {{ text: string, confidence: number }}
 */
async function performOcrInOffscreen(dataURL) {
	if (!ocrWorker) {
		ocrWorker = await Tesseract.createWorker("eng", 1, {
			workerPath: WORKER_PATH,
			corePath: CORE_PATH,
			workerBlobURL: false,
		});

		await ocrWorker.setParameters({
			// The only characters that appears
			tessedit_char_whitelist: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
		});
	}

	const { data } = await ocrWorker.recognize(dataURL);
	return data;
}

// Listen for messages from the Service Worker
/**
 * Handles two message types from the background service worker:
 * - `"OFFSCREEN_OCR_REQUEST"`: runs OCR on the supplied data URL.
 * - `"OFFSCREEN_TERMINATE_OCR_WORKER"`: terminates the worker to free memory.
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "OFFSCREEN_OCR_REQUEST" && message.dataURL) {
		performOcrInOffscreen(message.dataURL)
			.then(({ text, confidence }) => {
				sendResponse({ success: true, text, confidence });
			})
			.catch(error => {
				sendResponse({ success: false, error: error.message });
			});
		return true;
	}

	if (message.type === "OFFSCREEN_TERMINATE_OCR_WORKER") {
		if (ocrWorker) {
			ocrWorker.terminate();
			ocrWorker = null;
		}
		sendResponse({ success: true });
	}
});
