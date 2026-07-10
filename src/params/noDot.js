// Param matcher for the [style] and [component] segments. Their ids are always
// kebab-case with no dots (e.g. "neo-brutalism", "dropdown-menu"), so rejecting
// any segment containing a "." stops these dynamic page routes from shadowing
// sibling file-style endpoints (e.g. manifest.json). Without it, a client-side
// navigation to /<style>/manifest.json matches [component] and 404s until a hard
// refresh (the server already prefers the static route; the client router didn't).
/** @param {string} param */
export function match(param) {
	return !param.includes('.');
}
