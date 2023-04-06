import html2pdf from "html2pdf.js";

export const downloadPDF = (element: HTMLElement, filename: string = "banglarbhumi.pdf") => {
	html2pdf().set({
		margin: 0,
		filename: filename,
		image: {
			type: "jpeg",
			quality: 0.98
		},
		html2canvas: {
			scale: 1
		},
		jsPDF: {
			unit: "in",
			format: "letter",
			orientation: "portrait"
		}
	})
		.from(element)
		.save();
};
