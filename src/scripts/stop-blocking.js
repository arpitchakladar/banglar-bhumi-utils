let contextPath = "/BanglarBhumi";
let currentTheme = "";
let carrerData = "";
let previousTheme = "";
let menuHeader = "";
let user = "";
let user_type = "";
let beforeLoginModal = "";
let afterLoginModal = "";
let afterLoginDiv = "";
let beforeLoginDiv = "";
let afterLoginLabel = "";
let btngriv = "";
let modal1 = "";
let btn = "";
let span = "";

document.oncontextmenu = new Function("return true");
$(document).keydown(() => true);
$(document).ready(() => {
	switch_style(currentTheme);
	if (currentTheme == "black") {
		$(".dark").show();
		$(".light").hide();
	} else {
		$(".dark").hide();
		$(".light").show();
	}
	len = menuHeader.length;
	let fullMenu = "";
	for (let i = 0; i < len; i++) {
		const c1 = menuHeader.charAt(i);
		if (c1 == "[" || c1 == "]") {
		} else {
			fullMenu = fullMenu + c1;
		}
	}
	const arrayHeader = fullMenu.split(",");
	$.each(arrayHeader, (i) => {
		const m = arrayHeader[i].trim();
		$("#" + m).css("display", "block");
	});
	$(".light").click((event) => {
		$(".light").hide();
		$(".dark").show();
	});
	$(".dark").click((event) => {
		$(".light").show();
		$(".dark").hide();
		$.post(
			"getPrethemeName.action",
			{},
			(data) => {
				previousTheme = data.preTheme;
				switch_style(previousTheme);
			},
			"json"
		);
		return false;
	});
	$("input[name=theme]").click((event) => {
		$(".light").show();
		$(".dark").hide();
		return false;
	});
	if (carrerData == "Y") {
		$(".badge").show();
	} else {
		$(".badge").hide();
	}
});

function homePage() {
	window.location.href = contextPath + "/Home.action";
}

function ProfilePage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/Profile.action");
	$("#form_MainMenuPage").submit();
}

function AdministrativePage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/Administrative.action");
	$("#form_MainMenuPage").submit();
}

function RefugeeReliefRehabilationPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/RefugeeReliefRehabilation.action");
	$("#form_MainMenuPage").submit();
}

function AgricultureCensusPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/AgricultureCensus.action");
	$("#form_MainMenuPage").submit();
}

function LandPolicyBranchPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LandPolicyBranch.action");
	$("#form_MainMenuPage").submit();
}

function LRISBranchPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LRISBranch.action");
	$("#form_MainMenuPage").submit();
}

function RentControlPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/rent.action");
	$("#form_MainMenuPage").submit();
}

function ThikaPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/Thika.action");
	$("#form_MainMenuPage").submit();
}

function IndoBanglaPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/IndoBangla.action");
	$("#form_MainMenuPage").submit();
}

function StateLandUseBoardPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/StateLandUseBoard.action");
	$("#form_MainMenuPage").submit();
}

function GEMBranchPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/GEMBranch.action");
	$("#form_MainMenuPage").submit();
}

function RequisitionBranchPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/RequisitionBranch.action");
	$("#form_MainMenuPage").submit();
}

function MMBbranchPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/MMBbranchPage.action");
	$("#form_MainMenuPage").submit();
}

function SurveySetelmentBranchPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/SurveySetelmentBranch.action");
	$("#form_MainMenuPage").submit();
}

function CitizenCentricServicesPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/CitizenCentricServices.action");
	$("#form_MainMenuPage").submit();
}

function ARTIPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/ARTI.action");
	$("#form_MainMenuPage").submit();
}

function LMTCPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LMTC.action");
	$("#form_MainMenuPage").submit();
}

function EstablishmentPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/Establishment.action");
	$("#form_MainMenuPage").submit();
}

function LawBranch() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LawBranch.action");
	$("#form_MainMenuPage").submit();
}

function DistributionLandPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/DistributionLand.action");
	$("#form_MainMenuPage").submit();
}

function ManagementISUPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/ManagementISU.action");
	$("#form_MainMenuPage").submit();
}

function KeyPersonnelPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/KeyPersonnel.action");
	$("#form_MainMenuPage").submit();
}

function LandReformPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LandReform.action");
	$("#form_MainMenuPage").submit();
}

function DigitisationMapRecordsPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/DigitisationMapRecords.action");
	$("#form_MainMenuPage").submit();
}

function LandManagementPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LandManagement.action");
	$("#form_MainMenuPage").submit();
}

function PreparationUpdationMaintenancePage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/PreparationUpdationMaintenance.action");
	$("#form_MainMenuPage").submit();
}

function challanGeneratePage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "challanGenerate",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/challanGenerate.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function challanReprintPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "challanReprint",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/challanReprint.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function knowYourPropertyPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "KnowYourProperty",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/KnowYourProperty.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function serviceStatusLocWise() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "SerivceStatusLocationWise",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/SerivceStatusLocationWise.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function MuteApplicationPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "MuteApplication",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/MuteApplication.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function RORReqPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "RORReq",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/RORReq.action");
		$("#form_MainMenuPage").submit();
	}
}

function PIReqPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "PIReq",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/PIReq.action");
		$("#form_MainMenuPage").submit();
	}
}

function PlotMapReqPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "PlotMapReq",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/PlotMapReq.action");
		$("#form_MainMenuPage").submit();
	}
}

function MouzaMapReqPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "MouzaMapReq",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/MouzaMapReq.action");
		$("#form_MainMenuPage").submit();
	}
}
function MouzaMapAvailabilityPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "MouzaMapAvailabilityReq",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/MouzaMapAvailabilityReq.action"
		);
		$("#form_MainMenuPage").submit();
	}
}
function revenueApplicationPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "RevenueApplication",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/RevenueApplication.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function revenueApplicationListPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "RevenueApplicationList",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/RevenueApplicationList.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function revenueNoDueCertificatePage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "RevenueNoDueCertificate",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/RevenueNoDueCertificate.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function privateAminApplicationPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "PrivateAminApplication",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/privateAminApplicationPage.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function privateAminRegistrationPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "PrivateAminRegistration",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/privateAminRegistrationPage.action"
		);
		$("#form_MainMenuPage").submit();
	}
}
function revenueCollectionReportPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/revenueCollectionReportAction.action");
	$("#form_MainMenuPage").submit();
}
function Apprec_rep() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "Apprecrep",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/Apprecrep.action");
		$("#form_MainMenuPage").submit();
	}
}

function FeesCollectionPage(applicationNo) {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "FeesCollection",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		if (applicationNo == "")
			$("#form_MainMenuPage").attr(
				"action",
				contextPath + "/FeesCollection.action"
			);
		else
			$("#form_MainMenuPage").attr(
				"action",
				contextPath + "/FeesCollection.action?applnNo=" + applicationNo
			);
		$("#form_MainMenuPage").submit();
	}
}
function muteStatusPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "MuteStatus",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/MuteStatus.action");
		$("#form_MainMenuPage").submit();
	}
}

function convStatusPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "ConvStatus",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/ConvStatus.action");
		$("#form_MainMenuPage").submit();
	}
}

function warishStatusPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "WarishStatus",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/WarishStatus.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function plotKhatianStatusPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "PlotKhatianStatus",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/PlotKhatianStatus.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function rslrPlotInfoPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "RslrPlotInfo",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/RslrPlotInfo.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function landClassPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "LandClass",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/LandClass.action");
		$("#form_MainMenuPage").submit();
	}
}

function signedPdfPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "signedPdfList",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/signedPdfList.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function convAppViewPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "ConvAppViewAction",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/ConvAppViewAction.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function warishAppViewPage() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "WarishAppViewAction",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr(
			"action",
			contextPath + "/WarishAppViewAction.action"
		);
		$("#form_MainMenuPage").submit();
	}
}

function GrievApplicationPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/GrievAppViewAction.action");
	$("#form_MainMenuPage").submit();
}

function GrievStatusViewPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/GrievStatusViewAction.action");
	$("#form_MainMenuPage").submit();
}

function querySearchPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/QuerySearchAction.action");
	$("#form_MainMenuPage").submit();
}

function SiteMapPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/Sitemap.action");
	$("#form_MainMenuPage").submit();
}

function termuse() {
	$("#form_MainMenuPage").attr("action", contextPath + "/termsofuse.action");
	$("#form_MainMenuPage").submit();
}

function linkpol() {
	$("#form_MainMenuPage").attr("action", contextPath + "/linkingpolicy.action");
	$("#form_MainMenuPage").submit();
}

function pripol() {
	window.location.href = contextPath + "/privacypolicy.action";
}

function loadDashboard() {
	$("#form_MainMenuPage").attr("action", contextPath + "/dashboard.action");
	$("#form_MainMenuPage").submit();
}

function RegRenew_DashboardPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/RegRenew_Dashboard.action");
	$("#form_MainMenuPage").submit();
}

function feedback() {
	$("#form_MainMenuPage").attr("action", contextPath + "/feedBackPage.action");
	$("#form_MainMenuPage").submit();
}

function searchActionChange() {
	const functionChange = $(".search_select").val();
	eval(functionChange + "()");
}

function webInformationManger() {
	$("#form_MainMenuPage").attr("action", contextPath + "/webInformationManager.action");
	$("#form_MainMenuPage").submit();
}

function helpPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/help.action");
	$("#form_MainMenuPage").submit();
}

function ApplnsearchPageGrn() {
	$("#form_MainMenuPage").attr("action", contextPath + "/appliSearchGrn.action");
	$("#form_MainMenuPage").submit();
}

function LandAcquisitionPage() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LandAcquisition.action");
	$("#form_MainMenuPage").submit();
}

function LACollector() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LACollector.action");
	$("#form_MainMenuPage").submit();
}

function ScreenReaderAccess() {
	$("#form_MainMenuPage").attr("action", contextPath + "/ScreenReaderAccess.action");
	$("#form_MainMenuPage").submit();
}

function loadBrickFieldApplication() {
	$("#form_MainMenuPage").attr("action", contextPath + "/brickFieldApplication.action");
	$("#form_MainMenuPage").submit();
}

function loadBrickFieldModification() {
	$("#form_MainMenuPage").attr("action", contextPath + "/brickFieldModification.action");
	$("#form_MainMenuPage").submit();
}

function loadBrickFieldDemandSheet() {
	$("#form_MainMenuPage").attr("action", contextPath + "/brkFldDmndSheet.action");
	$("#form_MainMenuPage").submit();
}

function loadBrickFieldPayment() {
	$("#form_MainMenuPage").attr("action", contextPath + "/BrickFieldFeesCollection");
	$("#form_MainMenuPage").submit();
}

function loadBrickFieldReceiptReprint() {
	$("#form_MainMenuPage").attr("action", contextPath + "/brkFldApprecrep");
	$("#form_MainMenuPage").submit();
}

function loadGrnSearch() {
	if (user == "") {
		$.post(
			"putTargetMenuActionName.action",
			{
				message: "appGrnSrch",
				ajax: "true",
			},
			(data) => {},
			"json"
		);
		$.post("viewLoginAreaAction", (html) => {
			$("#login-modal .loginmodal-container").html(html);
			DrawLoginCaptcha();
			$("#login-modal").modal("show");
		});
		afterLoginModal.style.display = "none";
		afterLoginDiv.style.display = "none";
		afterLoginLabel.style.display = "none";
		beforeLoginModal.style.display = "none";
	} else {
		$("#form_MainMenuPage").attr("action", contextPath + "/appGrnSrch");
		$("#form_MainMenuPage").submit();
	}
}

function loadAddUserInformation() {
	$("#form_MainMenuPage").attr("action", contextPath + "/AddUserInformation.action");
	$("#form_MainMenuPage").submit();
}

function loadModifyUserInformation() {
	$("#form_MainMenuPage").attr("action", contextPath + "/modifyUserInformation.action");
	$("#form_MainMenuPage").submit();
}

$(() => {
	$(".langSaveToSession").click(function () {
		$.post("addLang.action", {
			language: $(this).attr("id"),
			ajax: "true",
		});
	});
});

function LandAcquisitionEntryMod() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LandAcquisitionEntryMod.action");
	$("#form_MainMenuPage").submit();
}

function LandAcquisitionRecordView() {
	$("#form_MainMenuPage").attr("action", contextPath + "/LandAcquisitionRecordView.action");
	$("#form_MainMenuPage").submit();
}

function openBrkFldModal() {
	const formInput = $(this).serialize();
	$.post(
		"distPopulateAction_KUP.action",
		formInput,
		(data) => {
			let listDistItems = "<option value='-1'>-----District List-----</option>";
			$.each(data.districtList, (key, value) => {
				listDistItems +=
					"<option value='" +
					value.dcode +
					"' style='color: grey'>" +
					"[ " +
					value.dcode +
					" ] " +
					value.uni_dname +
					"</option>";
			});
			$("select#lstDistrictCodeBrkFld").html(listDistItems);
			$("#brkfldmyModal").show();
		},
		"json"
	);
}

function saveLocation() {
	$(".transparentCover").show();
	$(".loading").show();
	$.ajax({
		type: "POST",
		url: "saveBrkFldLocation",
		data: {
			lstDistrictCodeBrkFld: $("#lstDistrictCodeBrkFld").val(),
		},
		success: function (response, textStatus) {
			$("#brkfldmyModal").hide();
			$("#information-modal .information").html(
				"<div class='alert alert-success'><strong>" +
					response +
					"</strong></div>"
			);
			$("#information-modal").modal("show");
			$(".transparentCover").hide();
			$(".loading").hide();
		},
		error: function (jqXHR, textStatus, exception) {
			$("#brkfldmyModal").hide();
			$("#information-modal .information").html(
				"<div class='alert alert-danger'><strong>" +
					exception +
					"</strong></div>"
			);
			$("#information-modal").modal("show");
			$(".transparentCover").hide();
			$(".loading").hide();
		},
	});
}
