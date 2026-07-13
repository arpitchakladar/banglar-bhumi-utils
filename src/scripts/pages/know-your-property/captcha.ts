/**
 * Hides the CAPTCHA section on the Know-Your-Property page and
 * stubs the captcha validation so the user can proceed without
 * solving a CAPTCHA.
 */
document.addEventListener("DOMContentLoaded", () => {
	$("#khatianPlotDiv > div:nth-child(6) > div").hide();
	(window as any).validateCaptcha = () => true;
});
