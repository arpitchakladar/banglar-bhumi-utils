export type OCRRequest = {
	type: "OFFSCREEN_OCR_REQUEST" | "OCR";
	dataURL: string
};

export type OCRResponse = {
	success: true;
	text: string;
	confidence: number
} | {
	success: false;
	error: string
};
