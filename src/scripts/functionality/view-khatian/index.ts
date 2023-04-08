import { downloadPDF } from "@/shared/download-pdf";
import getDownloadInformationPDFPageContent from "@/scripts/functionality/view-khatian/download-information-pdf-page-content";

declare function load(): void;

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

	let isPlotInformation: boolean | null = null;

	const downloadInformationPDF = () => {
		let contentElement = document.getElementById(isPlotInformation ? "plotdetails" : "khdetails");
		const documentStringContent = getDownloadInformationPDFPageContent(!!isPlotInformation, contentElement!.innerHTML, {
			district: getValueOfSelectElement("#lstDistrictCode1"),
			block: getValueOfSelectElement("#lstBlockCode1"),
			mouza: getValueOfSelectElement("#lstMouzaList")
		});
		downloadPDF(`<div id="content">${documentStringContent}</div>`);
	};

	$.post = function() {
		if (arguments[0].startsWith("plotDetailsAction_LandInfo.action")) {
			isPlotInformation = true;
		} else if (arguments[0].startsWith("khDetailsAction_LandInfo.action")) {
			isPlotInformation = false;
		}

		if (isPlotInformation !== null) {
			const callback = arguments[2];
			arguments[2] = (data: any) => {
				callback(data);
				const tableElement = document.querySelector(isPlotInformation
					? "#plotdetails > div:nth-child(1) > div:nth-child(4) > table > tbody"
					: "#khdetails > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table > tbody"
				) as HTMLElement | null;

				if (tableElement) {
					tableElement.style.height = "auto";
					tableElement.style.width = "100%";

					if (!downloadPDFButton) {
						downloadPDFButton = document.createElement("button");
						downloadPDFButton.innerHTML = "Download PDF";
						downloadPDFButton.style.cssText = styles;
						downloadPDFButton.style.width = "auto";
						downloadPDFButton.style.marginBottom = "1rem";
						downloadPDFButton.addEventListener("click", downloadInformationPDF);
						formElement.insertBefore(downloadPDFButton, separatorElement);
					}
				} else if (downloadPDFButton) {
					formElement.removeChild(downloadPDFButton);
					isPlotInformation = null;
					downloadPDFButton = null;
				}
			}
		}

		return proxiedPost.apply(this, Array.from(arguments) as any);
	}
});
