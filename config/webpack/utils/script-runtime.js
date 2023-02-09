module.exports.getScriptRuntimeFromType = scriptType => {
	switch (scriptType) {
		case "before":
		case "injected":
		case "injected_and_loaded":
			return "document_start";

		case "rendered":
			return "document_end";

		case "loaded":
		default:
			return "document_idle";
	}
};
