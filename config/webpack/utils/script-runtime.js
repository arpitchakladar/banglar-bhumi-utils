/**
 * Maps a human-readable script type to a Chrome content-script
 * `run_at` value.
 *
 * - `"before"`, `"injected-after"`, `"injected-before"` → `document_start`
 * - `"rendered"` → `document_end`
 * - `"loaded"` (or unknown) → `document_idle`
 *
 * @param {string} scriptType - The script type from scripts.json.
 * @returns {string} The corresponding `run_at` value.
 */
export function getScriptRuntimeFromType(scriptType) {
	switch (scriptType) {
		case "before":
		case "injected-after":
		case "injected-before":
			return "document_start";

		case "rendered":
			return "document_end";

		case "loaded":
		default:
			return "document_idle";
	}
};
