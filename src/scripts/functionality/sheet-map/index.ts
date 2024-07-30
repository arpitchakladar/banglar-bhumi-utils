import { generateWebPage } from "@/shared/generate-web-page";
import getDownloadMapPDFPageContent from "@/scripts/functionality/sheet-map/download-map-pdf-page-content.html";
import getMapSVGPathElementContent from "@/scripts/functionality/sheet-map/map-svg-path-element.html";
import getMapPlotLabelElementContent from "@/scripts/functionality/sheet-map/map-svg-plot-label-element.html";

interface PlotDetail {
	plotArea: number;
	plotno: string;
	polygon: string;
};

interface PlotLabel {
	plotno: string;
	point: string;
}

const downloadSVGButtonContainer = document.createElement("td");
const downloadSVGButton = document.createElement("button");
const downloadPDFButtonContainer = document.createElement("td");
const downloadPDFButton = document.createElement("button");
const downloadPDFWithOutLabelButtonContainer = document.createElement("td");
const downloadPDFWithOutLabelButton = document.createElement("button");
downloadSVGButton.innerHTML = "DOWNLOAD SVG";
downloadPDFButton.innerHTML = "DOWNLOAD PDF";
downloadPDFWithOutLabelButton.innerHTML = "DOWNLOAD PDF (NO LABELS)";
downloadSVGButtonContainer.appendChild(downloadSVGButton);
downloadPDFButtonContainer.appendChild(downloadPDFButton);
downloadPDFWithOutLabelButtonContainer.appendChild(downloadPDFWithOutLabelButton);
const svgElement = document.querySelector("svg");
document.querySelector("#headerTable > tbody > tr")!.appendChild(downloadSVGButtonContainer);
document.querySelector("#headerTable > tbody > tr")!.appendChild(downloadPDFButtonContainer);
document.querySelector("#headerTable > tbody > tr")!.appendChild(downloadPDFWithOutLabelButtonContainer);
const resetZoomButton = document.querySelector<HTMLButtonElement>("#btnResetZoom")!;
const plotNumberInput = document.querySelector<HTMLInputElement>("#txtPlotNo")!;
const plotInformation = document.createElement("div") as HTMLDivElement;
document.body.appendChild(plotInformation);

const setPlotInformation = (plotDetail: PlotDetail | null | undefined = null) => {
	if (plotDetail) {
		plotInformation.innerHTML = "<div>Plot Number: " + plotDetail.plotno + "</div><div>Area: " + (plotDetail.plotArea/1000).toFixed(3) + " acres</div>";
	} else {
		plotInformation.innerHTML = "<div>Plot Number: </div><div>Area: 0.000 acres</div>";
	}
};
setPlotInformation();

let plotDetailContent = "";
let plotLabelContent = "";

downloadSVGButton.addEventListener("click", e => {
	e.preventDefault();
	const element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(plotDetailContent + plotLabelContent)
	);
	element.setAttribute("download", "map.svg");
	element.style.display = "none";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
});

const downloadPDF = (labelPoints: boolean = true) => {
	generateWebPage(
		getDownloadMapPDFPageContent({
			mapContent: plotDetailContent + (labelPoints ? plotLabelContent : "")
		}),
		"map"
	);
};

downloadPDFButton.addEventListener("click", e => {
	e.preventDefault();
	downloadPDF();
});

downloadPDFWithOutLabelButton.addEventListener("click", e => {
	e.preventDefault();
	downloadPDF(false);
});

(async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const response1 = await fetch(
		"/BanglarBhumi/sheetMap_populateLayerData?lstSheetNo=" + searchParams.get("lstSheetNo"),
		{
			method: "POST"
		});
	const plotDetailList: PlotDetail[] = (await response1.json()).features;
	const response2 = await fetch(
		"/BanglarBhumi/sheetMap_populateCentroidData?lstSheetNo=" + searchParams.get("lstSheetNo"),
		{
			method: "POST"
		});
	const plotLabelList: PlotLabel[] = (await response2.json()).features;
	let plotDetails: { [key: string]: PlotDetail } = {};

	for (const plotDetail of plotDetailList) {
		const plotPolygonPoints = plotDetail.polygon.split("(((")[1].split(")))")[0];
		plotDetailContent += getMapSVGPathElementContent({
			polygonData: plotPolygonPoints
		});
	}

	for (const plotLabel of plotLabelList) {
		const plotLabelPoint = plotLabel.point.split("(")[1].split(")")[0].split(" ");
		plotLabelContent += getMapPlotLabelElementContent({
			plotLabelX: plotLabelPoint[0],
			plotLabelY: plotLabelPoint[1],
			plotNumber: plotLabel.plotno
		});
	}

	document.querySelector("#btnSearch")!.addEventListener("click", () => {
		let plotDetail;
		for (const p of plotDetailList) {
			if (p.plotno === plotNumberInput.value) {
				plotDetail = p;
				break;
			}
		}
		setPlotInformation(plotDetail);
	});

	await new Promise<void>((resolve, reject) => {
		const plotElementIdsControl = setInterval(() => {
			let i = 0;
			let plotElements = document.querySelector("#OpenLayers_Layer_Vector_25_vroot")?.children || [];
			if (plotElements.length) {
				clearInterval(plotElementIdsControl);
				for (let i = 0; i < plotElements.length; i++) {
					plotDetails[plotElements[i].id] = plotDetailList[i];
				}
				resolve();
			}
		}, 300);
	});

	setInterval(() => {
		for (const plotElementId in plotDetails) {
			const e = document.getElementById(plotElementId);
			if (e) {
				e.removeEventListener("click", handlePlotClick);
				e.addEventListener("click", handlePlotClick);
			}
		}
	}, 300);

	const handlePlotClick = (e: MouseEvent) => {
		document.querySelectorAll("path").forEach(e => {
			e.setAttribute("fill", "#ffcc66");
		});

		const target = e.target as SVGPathElement;

		target.setAttribute("fill", "#8aeeef");
		setPlotInformation(plotDetails[target.id]);
	};
})();
