import { interceptPost, interceptGet } from "@/shared/intercept-jquery-ajax";

interceptPost("viewLoginAreaAction", args => {
	const callback = args[1];
	args[1] = (html: any) => {
		callback(html);
		const captchaInputElement = $("#txtCaptcha");
		const captchaValueElement = $("#txtInput");
		captchaInputElement.val("FFFFFF");
		captchaValueElement.val("FFFFFF");
		(window as any).DrawLoginCaptcha = () => {};
		(window as any).validateLoginCaptcha = () => true;
		captchaValueElement.hide();
		captchaInputElement.hide();
		$(".captcharefresh").hide();
	}
});
interceptPost("viewPasswordRecoveryArea", args => {
	const callback = args[1];
	args[1] = (html: any) => {
		callback(html);
		const captchaInputElement = $("#dText");
		const captchaValueElement = $("#captaText");
		captchaInputElement.val("FFFFFF");
		captchaValueElement.val("FFFFFF");
		(window as any).Captcha = () => {};
		captchaValueElement.hide();
		captchaInputElement.hide();
		$("#captchaRef").hide();
	}
});
interceptPost("login.action", args => {
	const callback = args[2];
	args[2] = (data: any) => {
		const loginData = args[1];
		if (!data.exception && data.checkmsg === "success") {
			window.localStorage.setItem("loginData", btoa(JSON.stringify(loginData)));
		}

		callback(data);
		$("#txtInput").val("FFFFFF");
		$("#beforeLoginDiv").hide();
		$("#afterLoginDiv").css("display", "block");
		$("#afterLoginLabel").css("display", "block");
		const username = atob(loginData.username.split("RGxycyMxMjM=")[1]);
		$("#afterLoginLabel > label").html(`--> ${username}`);
	};
});
interceptPost("changePassword.action", args => {
	const callback = args[2];
	args[2] = (data: any) => {
		callback(data);
		$("#txtInput").val("FFFFFF");
	};
});
interceptGet("viewRegistrationAreaAction", args => {
	const callback = args[1];
	args[1] = (html: any) => {
		callback(html);
		const captchaInputElement = $("#regInputCaptcha");
		const captchaValueElement = $("#regCaptcha");
		captchaInputElement.val("FFFFFF");
		captchaValueElement.val("FFFFFF");
		$("#registrationForm > div > div:nth-child(5) > div:nth-child(3)").hide();
		$("#registrationForm > div > div:nth-child(5) > div:nth-child(4)").hide();
		$("#registrationForm > div > div:nth-child(5) > div:nth-child(5)").hide();
		(window as any).DrawRegistrationCaptcha = () => {};
		(window as any).validateRegistrationCaptcha = () => true;
	}
});
interceptGet("viewChangePasswordAction", args => {
	const callback = args[1];
	args[1] = (html: any) => {
		callback(html);
		const captchaValueElement = $("#txtCaptcha");
		const captchaInputElement = $("#txtInput");
		captchaValueElement.val("FFFFFF");
		captchaInputElement.val("FFFFFF");
		(window as any).DrawLoginCaptcha = () => {};
		captchaValueElement.hide();
		captchaInputElement.hide();
		$(".captcharefresh").hide();
	}
});

document.addEventListener("DOMContentLoaded", () => {
	$("#afterLoginDiv > a").click(() => {
		window.localStorage.removeItem("loginData");
	});

	setInterval(() => {
		let loginData = window.localStorage.getItem("loginData");
		loginData = loginData ? JSON.parse(atob(loginData)) : null;

		if (loginData) {
			$.post(
				"/BanglarBhumi/login.action",
				loginData,
				data => {
					if (data.exception || data.checkmsg !== "success") {
						loginData = null;
					}
				},
				"json"
			);
		}
	}, 1000 * 60 * 5);
});
