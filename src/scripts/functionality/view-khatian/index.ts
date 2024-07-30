import { generateWebPage } from "@/shared/generate-web-page";
import { interceptPost } from "@/shared/intercept-jquery-ajax";
import getDownloadInformationPDFPageContent from "@/scripts/functionality/view-khatian/download-information-pdf-page-content.html";

const submitButtonElement = $("#khbutton");
const separatorElement = $("#bodycover > div > form > hr:nth-child(2)");
const formElement = $("#bodycover > div > form");
let downloadPDFButton: JQuery<HTMLButtonElement> | null = null;

const submitButtonElementComputedStyles = window.getComputedStyle(submitButtonElement[0]);
const styles = Array.from(submitButtonElementComputedStyles)
	.reduce(
		(str, property) => `${str}${property}:${submitButtonElementComputedStyles.getPropertyValue(property)};`,
		""
	);

const getValueOfSelectElement = (selector: string) => {
	const element = document.querySelector<HTMLSelectElement>(selector)!;
	return element.options[element.selectedIndex].text;
};

let isPlotInformation: boolean | null = null;

const downloadInformationPDF = () => {
	generateWebPage(
		getDownloadInformationPDFPageContent({
			isPlotInformation: !!isPlotInformation,
			details: $(isPlotInformation ? "#plotdetails" : "#khdetails").html(),
			district: getValueOfSelectElement("#lstDistrictCode1"),
			block: getValueOfSelectElement("#lstBlockCode1"),
			mouza: getValueOfSelectElement("#lstMouzaList")
		}),
		isPlotInformation
			? "Plot Details"
			: "Khatian Details"
	);
};

const showDownloadButton = (args: any) => {
	if (isPlotInformation !== null) {
		const callback = args[2];
		args[2] = (data: any) => {
			callback(data);
			const tableElement = $(isPlotInformation
				? "#plotdetails > div:nth-child(1) > div:nth-child(4) > table > tbody"
				: "#khdetails > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table > tbody"
			);

			if (tableElement.length) {
				tableElement.css("height", "auto");
				tableElement.css("width", "100%");

				if (!downloadPDFButton) {
					downloadPDFButton = $(document.createElement("button"));
					downloadPDFButton.html("Download PDF");
					downloadPDFButton[0].style.cssText = styles;
					downloadPDFButton.css("width", "auto");
					downloadPDFButton.css("margin-bottom", "1rem");
					downloadPDFButton.click(downloadInformationPDF);
					formElement[0].insertBefore(downloadPDFButton[0], separatorElement[0]);
				}
			} else if (downloadPDFButton) {
				($(downloadPDFButton as any) as any).remove();
				isPlotInformation = null;
				downloadPDFButton = null;
			}
		}
	}
};

interceptPost("plotDetailsAction_LandInfo.action", args => {
	isPlotInformation = true;
	showDownloadButton(args);
});
interceptPost("khDetailsAction_LandInfo.action", args => {
	isPlotInformation = false;
	showDownloadButton(args);
});
