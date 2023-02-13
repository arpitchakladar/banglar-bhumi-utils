module.exports.getScriptRuntimeFromType = scriptType => {
	switch (scriptType) {
		case "before":
		case "injected":
			return "document_start";

		case "rendered":
			return "document_end";

		case "loaded":
		default:
			return "document_idle";
	}
};
