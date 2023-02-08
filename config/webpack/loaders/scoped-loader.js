const path = require("path");

module.exports = function (source) {
	return `/**\t${path.basename(this.resourcePath)}\t**/\n(() => {\n${source}\n})();`
};
