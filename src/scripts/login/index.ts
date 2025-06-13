import { interceptPost, interceptGet } from "@/shared/intercept-jquery-ajax";

function prepareCaptcha(ctx: CanvasRenderingContext2D, width: number, height: number) {
	const imgData = ctx.getImageData(0, 0, width, height);
	const data = imgData.data;
	const radius = 1;

	function isBlack(r: number, g: number, b: number) {
		return r < 50 && g < 50 && b < 50;
	}

	function isGrayish(r: number, g: number, b: number) {
		return Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && r > 100 && r < 200;
	}

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

const observer = new MutationObserver((mutationsList, obs) => {
	for (const mutation of mutationsList) {
		for (const node of mutation.addedNodes) {
			if ((node as any).nodeType === 1 && (node as any).id === "loginform") {
				const img = (node as HTMLFormElement).querySelector("#captchaImg") as HTMLImageElement;
				const captchaInput = (node as HTMLFormElement).querySelector("#txtInput") as HTMLInputElement;

				// Wait for image to load to get correct dimensions
				img.addEventListener("load", async () => {
					const { width, height } = img;

					// 1. Create canvas
					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					canvas.style.display = "block";

					// 2. Copy styles (optional)
					canvas.style.cssText = getComputedStyle(img).cssText;
					canvas.style.display = "none";

					// 3. Insert canvas before image
					img.parentNode!.querySelectorAll("canvas").forEach(c => c.remove());
					img.parentNode!.insertBefore(canvas, img);

					// 4. Hide image
					img.style.display = "none";

					// 5. Draw the image onto the canvas
					const ctx = canvas.getContext("2d")!;
					ctx.drawImage(img, 0, 0);
					prepareCaptcha(ctx, canvas.width, canvas.height);
					canvas.style.display = "";
					const dataURL = canvas.toDataURL("image/png");

					// Perform OCR
					chrome.runtime.sendMessage(
						{ type: "OCR", dataURL },
						({ success, text, confidence }) => {
							if (success) {
								if (confidence < 85) {
									// Reset the captcha if confidence is low
									img.src = "generateCaptcha?" + new Date().getTime();
								} else {
									captchaInput.value = text;
								}
							}
						},
					);
				});
			}
		}
	}
});

// Start observing the body
observer.observe(document.body, { childList: true, subtree: true });
