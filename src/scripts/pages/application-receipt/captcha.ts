/**
 * Hides the CAPTCHA section on the application-receipt page and
 * stubs the form validation so the user can proceed without
 * solving a CAPTCHA.
 */
type WindowApplicationReceipt = {
	validateForm?: () => boolean
} & Window;

document.addEventListener("DOMContentLoaded", () => {
	$("#werter > div > form > div:nth-child(4)").hide();
	(window as WindowApplicationReceipt).validateForm = () => true;
});
