const proxiedPost = $.post;

$.post = function() {
	let element: HTMLInputElement | null = null;
	if (arguments[0].endsWith("MISPetitionSmsSend.action")) {
		element = document.querySelector("input[name=mobile_Code]") as HTMLInputElement;
	} else if (arguments[0].endsWith("MISPetitionEmailSend.action")) {
		element = document.querySelector("input[name=txtemail_Code]") as HTMLInputElement;
	}

	if (element !== null) {
		const callback = arguments[2];
		arguments[2] = (data: any) => {
			element!.value = data?.messageShow || "";
			callback(data);
		};
	}

	return proxiedPost.apply(this, Array.from(arguments) as any);
};
