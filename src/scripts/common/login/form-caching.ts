import { addPostListener, addPostResponder, JQueryAjaxResponse } from "@/shared/intercept-jquery-ajax";

/** Caches the login area HTML to avoid re-fetching it on subsequent requests. */
let loginAreaHTML: JQueryAjaxResponse | null = null;

/**
 * Intercepts `viewLoginAreaAction` AJAX requests and serves the cached HTML
 * if available, avoiding an unnecessary network round-trip.
 */
addPostResponder(
	"viewLoginAreaAction",
	function(_args): JQueryAjaxResponse | null {
		return loginAreaHTML;
	}
);

/**
 * Listens for successful `viewLoginAreaAction` responses and stores the
 * returned HTML so the responder above can serve it from cache later.
 */
addPostListener(
	"viewLoginAreaAction",
	function(_args, result): void {
		if (result.textStatus === "success")
			loginAreaHTML = result;
	},
	false
);
