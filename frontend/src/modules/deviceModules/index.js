// Auto-discover all device module files in this directory using Vite's import.meta.globEager
// This allows adding a new device module file (e.g. `camera.js`) without touching this index.
const modules = import.meta.globEager('./*.js')

const deviceModules = Object.entries(modules)
	// exclude this index file
	.filter(([path]) => !path.endsWith('/index.js'))
	.map(([, mod]) => mod.default)
	.filter(Boolean)

export default deviceModules
