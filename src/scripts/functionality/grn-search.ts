$("#frmpaymentDetails > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)").hide();
const captcha = $("#txtDrawText");
const captchaText = $("#captchaText");
captcha.val((captchaText.val() as string).replaceAll(" ", ""));

const requestTypeElement = $("#lstRequestType");
const grnNumberElement = $("#txtGRN_NO");
const applicationNumberElement = $("#txtAPPLN_NO");

const requestType = localStorage.getItem("requestType");
const grnNumber = localStorage.getItem("grnNumber");
const applicationNumber = localStorage.getItem("applicationNumber");

if (requestType) {
	requestTypeElement.val(requestType);
}

if (grnNumber) {
	grnNumberElement.val(grnNumber);
}

if (applicationNumber) {
	applicationNumberElement.val(applicationNumber);
}

$("#btnSubmitGRNNo").click(() => {
	captcha.val((captchaText.val() as string).replaceAll(" ", ""));
	localStorage.setItem("requestType", requestTypeElement.val() as string);
	localStorage.setItem("grnNumber", grnNumberElement.val() as string);
	localStorage.setItem("applicationNumber", applicationNumberElement.val() as string);
});
