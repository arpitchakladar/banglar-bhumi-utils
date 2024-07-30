import { generateWebPage } from "@/shared/generate-web-page";
import getDownloadMapPDFPageContent from "@/scripts/functionality/sheet-map/download-map-pdf-page-content.html";
import getMapPlotPolygonPathElement from "@/scripts/functionality/sheet-map/map-plot-polygon-path-element.html";
import getMapPlotNumberLabelTextElement from "@/scripts/functionality/sheet-map/map-plot-number-label-text-element.html";
import getPlotInformationElement from "@/scripts/functionality/sheet-map/plot-information-element.html";

interface PlotPolygon {
	plotArea: number;
	plotno: string;
	polygon: string;
};

interface PlotNumberLabel {
	plotno: string;
	point: string;
}

const headerElement = document.querySelector("#headerTable > tbody > tr")!;
const plotNumberInput = document.querySelector<HTMLInputElement>("#txtPlotNo")!;
const plotInformation = document.createElement("div") as HTMLDivElement;
let plotPolygonPathElements = "";
let plotNumberLabelTextElements = "";

document.body.appendChild(plotInformation);

const createHeaderButton = (text: string) => {
	const buttonContainer = document.createElement("td");
	const button = document.createElement("button");
	button.innerHTML = text;
	button.style.display = "none";
	buttonContainer.appendChild(button);
	headerElement.appendChild(buttonContainer);
	return button;
};

const setPlotInformation = (plotPolygon: PlotPolygon | null | undefined = null) => {
	plotInformation.innerHTML = plotPolygon ? getPlotInformationElement({
		area: (plotPolygon.plotArea/1000).toFixed(3),
		plotNumber: plotPolygon.plotno
	}) : getPlotInformationElement({
		area: "0.000",
		plotNumber: ""
	});
};

const downloadPDF = (labelPoints: boolean = true) => {
	const _getMapDetail = (i: number) => {
		const detail = document.querySelector(`#headerTable > tbody > tr > td:nth-child(${i})`)!
			.innerHTML
			.split("[")[1]
			.trim();
		return detail.substr(0, detail.length - 1);
	};
	generateWebPage(
		getDownloadMapPDFPageContent({
			district: _getMapDetail(1),
			block: _getMapDetail(2),
			mouza: _getMapDetail(3),
			mapContent: plotPolygonPathElements + (labelPoints ? plotNumberLabelTextElements : "")
		}),
		"map"
	);
};

const downloadPDFButton = createHeaderButton("SAVE PDF");
const downloadPDFNoLabelButton = createHeaderButton("SAVE PDF (NO LABEL)");

downloadPDFButton.addEventListener("click", e => {
	e.preventDefault();
	downloadPDF();
});

downloadPDFNoLabelButton.addEventListener("click", e => {
	e.preventDefault();
	downloadPDF(false);
});

setPlotInformation();

(async () => {
	const searchParams = new URLSearchParams(window.location.search);
	const response1 = await fetch(
		"/BanglarBhumi/sheetMap_populateLayerData?lstSheetNo=" + searchParams.get("lstSheetNo"),
		{
			method: "POST"
		});
	const plotPolygonList: PlotPolygon[] = (await response1.json()).features;
	const response2 = await fetch(
		"/BanglarBhumi/sheetMap_populateCentroidData?lstSheetNo=" + searchParams.get("lstSheetNo"),
		{
			method: "POST"
		});
	const plotNumberLabelList: PlotNumberLabel[] = (await response2.json()).features;
	let plotPolygons: { [key: string]: PlotPolygon } = {};

	for (const plotPolygon of plotPolygonList) {
		const plotPolygonPoints = plotPolygon.polygon.split("(((")[1].split(")))")[0];
		plotPolygonPathElements += getMapPlotPolygonPathElement({
			polygonVertices: plotPolygonPoints
		});
	}

	for (const plotNumberLabel of plotNumberLabelList) {
		const plotNumberLabelPoint = plotNumberLabel.point.split("(")[1].split(")")[0].split(" ");
		plotNumberLabelTextElements += getMapPlotNumberLabelTextElement({
			x: plotNumberLabelPoint[0],
			y: plotNumberLabelPoint[1],
			plotNumber: plotNumberLabel.plotno
		});
	}

	downloadPDFButton.style.display = "inherit";
	downloadPDFNoLabelButton.style.display = "inherit";

	document.querySelector("#btnSearch")!.addEventListener("click", () => {
		let plotPolygon;
		for (const p of plotPolygonList) {
			if (p.plotno === plotNumberInput.value) {
				plotPolygon = p;
				break;
			}
		}
		setPlotInformation(plotPolygon);
	});

	await new Promise<void>((resolve, reject) => {
		const plotElementIdsControl = setInterval(() => {
			let i = 0;
			let plotElements = document.querySelector("#OpenLayers_Layer_Vector_25_vroot")?.children || [];
			if (plotElements.length) {
				clearInterval(plotElementIdsControl);
				for (let i = 0; i < plotElements.length; i++) {
					plotPolygons[plotElements[i].id] = plotPolygonList[i];
				}
				resolve();
			}
		}, 50);
	});

	setInterval(() => {
		for (const plotElementId in plotPolygons) {
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
		setPlotInformation(plotPolygons[target.id]);
	};
})();
