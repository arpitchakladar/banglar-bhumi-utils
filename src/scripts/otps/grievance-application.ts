import { addAutofillOtps } from "@/shared/autofill-otp";

addAutofillOtps([
	["MISPetitionSmsSend.action", "input[name=mobile_Code]"],
	["MISPetitionEmailSend.action", "input[name=txtemail_Code]"]
]);
