import { observeDOM } from "@/shared/observe-dom";

/**
 * Pre-processes a CAPTCHA image on a canvas by removing grayish
 * background noise while preserving dark pixels, producing a clean
 * binary image suitable for OCR.
 *
 * @param ctx    - The 2D rendering context of the canvas.
 * @param width  - Canvas width in pixels.
 * @param height - Canvas height in pixels.
 */
function prepareCaptcha(ctx: CanvasRenderingContext2D, width: number, height: number) {
	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;
	const radius = 1;

	/** Returns true when all three channels are below 50 (very dark). */
	function isBlack(r: number, g: number, b: number) {
		return r < 50 && g < 50 && b < 50;
	}

	/** Returns true when the colour is a mid-range grey (no strong hue). */
	function isGrayish(r: number, g: number, b: number) {
		return Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 100 && r < 200;
	}

	/**
	 * Checks whether a black pixel exists within `radius` pixels of (x, y).
	 * Used to preserve dark structures when removing grey noise.
	 */
	function hasNearbyBlack(x: number, y: number) {
		for (let dx = -radius; dx <= radius; dx++) {
			for (let dy = -radius; dy <= radius; dy++) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					const i = (ny * width + nx) * 4;
					if (isBlack(data[i], data[i + 1], data[i + 2])) return true;
				}
			}
		}
		return false;
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;
			const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
			if (isGrayish(r, g, b) && !hasNearbyBlack(x, y)) {
				data[i] = data[i + 1] = data[i + 2] = 255;
			}
		}
	}
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const i = (y * width + x) * 4;
			const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

			if (isGrayish(r, g, b)) {
				data[i] = data[i + 1] = data[i + 2] = 0; // make black
			}
		}
	}
	ctx.putImageData(imgData, 0, 0);
}

observeDOM(() => {
	const loginFormElement = document.querySelector("#loginform") as (HTMLFormElement | undefined);

	if (loginFormElement) {
		const captchaImg = loginFormElement.querySelector("#captchaImg") as HTMLImageElement;
		const captchaInput = loginFormElement.querySelector("#txtInput") as HTMLInputElement;

		// Wait for image to load to get correct dimensions
		captchaImg.addEventListener("load", async () => {
			const { width, height } = captchaImg;

			// 1. Create canvas
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			canvas.style.display = "block";

			// 2. Copy styles (optional)
			canvas.style.cssText = getComputedStyle(captchaImg).cssText;
			canvas.style.display = "none";

			// 3. Insert canvas before image
			captchaImg.parentNode!.querySelectorAll("canvas").forEach(c => c.remove());
			captchaImg.parentNode!.insertBefore(canvas, captchaImg);

			// 4. Hide image
			captchaImg.style.display = "none";

			// 5. Draw the image onto the canvas
			const ctx = canvas.getContext("2d")!;
			ctx.drawImage(captchaImg, 0, 0);
			prepareCaptcha(ctx, canvas.width, canvas.height);
			canvas.style.display = "";
			const dataURL = canvas.toDataURL("image/png");

			// Perform OCR
			chrome.runtime.sendMessage(
				{ type: "OCR", dataURL },
				({ success, text, confidence }) => {
					if (success) {
						const textResult = text.trim();
						if (confidence < 80 || textResult.length !== 6) {
							// Reset the captcha if confidence is low
							captchaImg.src = "generateCaptcha?" + new Date().getTime();
						} else {
							captchaInput.value = textResult;
						}
					}
				},
			);
		});
	}

	// This runs forever
	return false;
});
