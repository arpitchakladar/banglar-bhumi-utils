import { PDFDocument, StandardFonts } from "pdf-lib";
import { observeDOM } from "@/shared/observe-dom";

const sanghaFacilitationCentreBannerUrl = "$l{ /assets/sangha-facilitation-centre-banner.jpg }l$";

/**
 * On the Mutation Application form, removes the form action (to prevent
 * the default server-side submit) and attaches a custom click handler
 * that fetches the declaration PDF, overlays a banner image and date
 * stamp on the last page, then triggers a download.
 */
document.addEventListener("DOMContentLoaded", () => {
	observeDOM(() => {
		const formElement = $("#form_MutationApplication > div > div:nth-child(14) > div.col-sm-2.btreset > form");
		const submitButtonElement = $("#btnDeclareForm");
		if (formElement.length > 0 && submitButtonElement.length > 0) {
			formElement.removeAttr("action");
			submitButtonElement.on("click", (submitButtonClickEvent) => {
				submitButtonClickEvent.preventDefault();

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
					const { width, height: _ } = lastPage.getSize();
					const bannerImage = await pdfDoc.embedJpg(await fetch(sanghaFacilitationCentreBannerUrl).then(res => res.arrayBuffer()));
					const bannerImageHeight = width * (bannerImage.height / bannerImage.width);

					lastPage.drawImage(bannerImage, {
						x: 0,
						y: 0,
						width: width,
						height: bannerImageHeight
					});

					lastPage.drawText(pdfDoc.getCreationDate()!.toLocaleString(), {
						x: 10,
						y: bannerImageHeight,
						size: 12,
						font: await pdfDoc.embedFont(StandardFonts.TimesRoman)
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
