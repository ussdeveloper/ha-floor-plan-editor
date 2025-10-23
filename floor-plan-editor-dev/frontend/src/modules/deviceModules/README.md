Device modules
=================

Each device module describes a type of entity that can be dragged onto the canvas.
Modules live in `frontend/src/modules/deviceModules` and are auto-discovered by Vite
using `import.meta.globEager`, so adding a new file here will automatically expose
the new device in the palette without touching other code.

Module shape
------------

A module must export a default object with the following properties:

- `type` (string) — unique identifier, e.g. `light`
- `name` (string) — localized display name
- `icon` (React component) — icon component used in the palette (we use Heroicons)
- `defaultProps` (object) — default rendering properties used when creating an element

Example (`light.js`)

```js
import { LightBulbIcon } from '@heroicons/react/24/outline'

export default {
  type: 'light',
  name: 'Światło',
  icon: LightBulbIcon,
  defaultProps: {
    width: 40,
    height: 40,
    color: '#fbbf24',
    states: {
      on: { color: '#fbbf24', opacity: 1 },
      off: { color: '#6b7280', opacity: 0.5 }
    }
  }
}
```

Canvas rendering
----------------

Currently the canvas rendering draws simple shapes (circles/rects) for devices
and groups for sensors (icon + label). If you want a custom SVG icon on the canvas
you can add an `iconSvg` property to the module with an SVG string and update the
canvas renderer (see `frontend/src/components/Canvas.jsx` and `RoomCanvas.jsx`).

Adding a new module
-------------------

1. Create a new file `frontend/src/modules/deviceModules/<yourType>.js` following
   the example above.
2. Restart the dev server (Vite) — new modules are hot-reloaded automatically in dev.
3. The new device will appear under the "Urządzenia" tab in the palette and can
   be dragged onto the canvas.
