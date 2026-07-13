declare module "*.html" {
	function content(_replacements: Record<string, unknown>): string;
	export default content;
}
