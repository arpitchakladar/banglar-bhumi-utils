type AutofillOTPRule = readonly [string, string]

let otpAutofillList: AutofillOTPRule[] = [];

document.addEventListener("DOMContentLoaded", () => {
	const proxiedPost = $.post;

	$.post = function() {
		for (const rule of otpAutofillList) {
			if (arguments[0].endsWith(rule[0])) {
				const element: HTMLInputElement | null = document.querySelector(rule[1]) as HTMLInputElement | null;

				if (element) {
					const callback = arguments[2];
					arguments[2] = (data: any) => {
						element!.value = data?.messageShow || "";
						callback(data);
					};
				}

				break;
			}
		}

		return proxiedPost.apply(this, Array.from(arguments) as any);
	};
});

export const addAutofillOtps = (addedOTPAutofillList: readonly AutofillOTPRule[]) => {
	otpAutofillList = otpAutofillList.concat(addedOTPAutofillList);
};
