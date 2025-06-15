document.addEventListener("DOMContentLoaded", () => {
	$("#khatianPlotDiv > div:nth-child(6) > div").hide();
	(window as any).validateCaptcha = () => true;
});
