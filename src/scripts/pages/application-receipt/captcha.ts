/**
 * Hides the CAPTCHA section on the application-receipt page and
 * stubs the form validation so the user can proceed without
 * solving a CAPTCHA.
 */
document.addEventListener("DOMContentLoaded", () => {
	$("#werter > div > form > div:nth-child(4)").hide();
	(window as any).validateForm = () => true;
});
