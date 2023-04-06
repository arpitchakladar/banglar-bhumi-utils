import { downloadPDF } from "@/shared/download-pdf";
import getKhatinDetailsPDFPageData from "@/scripts/functionality/view-khatian/khatian-download-document";

declare function loadKhatian(): void;

document.addEventListener("DOMContentLoaded", () => {
	const proxiedPost = $.post;

	const submitButtonElement = document.querySelector("#khbutton") as HTMLButtonElement;
	const separatorElement = document.querySelector("#bodycover > div > form > hr:nth-child(2)") as HTMLElement;
	const formElement = document.querySelector("#bodycover > div > form") as HTMLElement;
	let downloadPDFButton: HTMLButtonElement | null = null;

	const submitButtonElementComputedStyles = window.getComputedStyle(submitButtonElement);
	const styles = Array.from(submitButtonElementComputedStyles)
		.reduce(
			(str, property) => `${str}${property}:${submitButtonElementComputedStyles.getPropertyValue(property)};`,
			""
		);

	const getValueOfSelectElement = (selector: string) => {
		const element = document.querySelector(selector) as HTMLSelectElement;
		return element.options[element.selectedIndex].text;
	};

	const downloadKhatianInformationPDF = () => {
		const documentStringContent = getKhatinDetailsPDFPageData(document.querySelector("#khdetails")!.innerHTML, {
			district: getValueOfSelectElement("#lstDistrictCode1"),
			block: getValueOfSelectElement("#lstBlockCode1"),
			mouza: getValueOfSelectElement("#lstMouzaList")
		});
		downloadPDF(`<div id="content">${documentStringContent}</div>`, "khatian-details.pdf");
	};

	$.post = function() {
		if (arguments[0].startsWith("khDetailsAction_LandInfo.action")) {
			const callback = arguments[2];
			arguments[2] = (data: any) => {
				callback(data);
				const tableElement = document.querySelector("#khdetails > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table > tbody") as HTMLElement | null;

				if (tableElement) {
					tableElement.style.height = "auto";
					tableElement.style.width = "100%";

					if (!downloadPDFButton) {
						downloadPDFButton = document.createElement("button");
						downloadPDFButton.innerHTML = "Download PDF";
						downloadPDFButton.style.cssText = styles;
						downloadPDFButton.style.width = "auto";
						downloadPDFButton.addEventListener("click", downloadKhatianInformationPDF);
						formElement.insertBefore(downloadPDFButton, separatorElement);
					}
				} else if (downloadPDFButton) {
					formElement.removeChild(downloadPDFButton);
					downloadPDFButton = null;
				}
			}
		}

		return proxiedPost.apply(this, Array.from(arguments) as any);
	}
});
