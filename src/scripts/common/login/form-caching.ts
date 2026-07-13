import { addPostListener, addPostResponder, JQueryAjaxResponse } from "@/shared/intercept-jquery-ajax";

let loginAreaHTML: string | null = null;

addPostResponder(
	"viewLoginAreaAction",
	function(_args): JQueryAjaxResponse | undefined | null {
		return loginAreaHTML
			? {
				data: loginAreaHTML
			}
			: null;
	}
);

addPostListener(
	"viewLoginAreaAction",
	function(_args, result): void {
		loginAreaHTML = result.data?.toString() ?? "";
	},
	false
);
