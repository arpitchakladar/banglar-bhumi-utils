import { PDFDocument } from "pdf-lib";
import { observeDOM } from "@/shared/observe-dom";

const sanghaFacilitationCentreBannerUrl = chrome.runtime.getURL("/assets/sangha-facilitation-centre-banner.jpg");

document.addEventListener("DOMContentLoaded", () => {
	observeDOM(() => {
		const formElement = document.querySelector("#form_MutationApplication > div > div:nth-child(14) > div.col-sm-2.btreset > form");
		const submitButtonElement = document.getElementById("btnDeclareForm");
		if (formElement && submitButtonElement) {
			formElement.removeAttribute("action");
			submitButtonElement.addEventListener("click", e => {
				e.preventDefault();

				(async () => {
					const pdfDoc = await PDFDocument.load(await fetch("/BanglarBhumi/MutationDeclarationForm.action", {
						method: "post",
						credentials: "same-origin",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						body: "hdnAppNo="
					}).then(res => res.arrayBuffer()));
					const pages = pdfDoc.getPages();
					const lastPage = pages[pages.length - 1];
					const { width, height } = lastPage.getSize();
					const bannerImage = await pdfDoc.embedJpg(await fetch(sanghaFacilitationCentreBannerUrl).then(res => res.arrayBuffer()));
					lastPage.drawImage(bannerImage, {
						x: 0,
						y: 0,
						width: width,
						height: width * (bannerImage.height / bannerImage.width),
					});

					const link = document.createElement("a");
					link.href = window.URL.createObjectURL(new Blob([new Uint8Array(await pdfDoc.save())], {type: "application/pdf"}));
					link.download = "Declaration.pdf";
					link.click();
				})();
			});

			return true;
		} else {
			return false;
		}
	});
});