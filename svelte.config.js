import sveltePreprocess from "svelte-preprocess";
import adapterVercel from "@sveltejs/adapter-vercel";
import path from "path";
import { readdirSync } from "fs";

/**
 * Lists urls of all static routes in `path`.
 *
 * @param {string} p - The path to search
 *
 * @returns {string[]}
 */
function listRoutesIn(p) {
	const routesPath = path.join("./src/routes/", p);
	const dir = readdirSync(routesPath, { withFileTypes: true });

	const filenames = dir
		.filter(({ isFile, name }) => isFile && !name.startsWith("_"))
		.map((dirent) => dirent.name);

	if (filenames.length === 0) {
		throw new Error(`listRoutesIn: No static routes found in '${p}'`);
	}

	const routes = filenames.map((filename) => {
		const name = path.parse(filename).name;
		return path.join("/", p, name);
	});

	// Ensure that all routes start with '/'
	const normalizedRoutes = routes.map((route) => path.posix.join('/', route));

	return normalizedRoutes;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte"],
	kit: {
		adapter: adapterVercel(),
		prerender: {
			enabled: true,
			default: true,
			entries: ["*", ...listRoutesIn("icon")]  // Removed leading slash to match your directory structure
		},
		alias: {
			$: "src"
		}
	},
	preprocess: sveltePreprocess({ postcss: true, typescript: true })
};

export default config;
