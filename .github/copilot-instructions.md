# HA Floor Plan Editor - AI Agent Instructions

## Architecture Overview

This is a **Home Assistant addon** with a React frontend + Express backend that creates interactive floor plans for smart home dashboards.

**Key components:**
- `backend/index.js` - Express API server with WebSocket support, HA API integration via Supervisor
- `frontend/` - Vite + React SPA using Fabric.js for canvas drawing
- `addon/` - Home Assistant addon metadata and Docker config
- State management: Zustand (`frontend/src/store/editorStore.js`)

**Data flow:**
```
User draws on Fabric.js canvas → Zustand store (elements/roomElements) 
→ Backend API saves to YAML → Export transforms to Lovelace/Floorplan format
→ POST to HA API adds card directly to dashboard
```

## Critical Developer Workflows

### Local Development
```bash
# Terminal 1 - Backend (port 3000)
cd backend && npm install && node index.js

# Terminal 2 - Frontend dev server (port 5173, proxies /api to :3000)
cd frontend && npm install && npm run dev
```

### Testing in Home Assistant
- Backend expects `SUPERVISOR_TOKEN` and `SUPERVISOR_URL` env vars (auto-set in addon)
- For local testing outside HA, set `HA_TOKEN` and `HA_URL` manually

### Version Management & Releases
**CRITICAL**: Each code change must update version and trigger builds for multi-channel releases:

1. **Update `addon/config.json`** - increment `"version"` (semantic versioning)
2. **Commit triggers GitHub Actions** which builds for 3 channels:
   - `nightbuild` - auto-updates on every commit (experimental users)
   - `development` - manual merge from main (active testers)
   - `release` - stable releases only

**Workflow:**
```bash
# After any feature/fix:
1. Edit addon/config.json → bump version
2. git commit -m "feat: description" 
3. Push → nightbuild auto-updates
4. Merge to development branch → development channel updates
5. Tag release → release channel updates
```

Home Assistant tracks versions per-channel; users see update notifications when version increments.

## Project-Specific Patterns

### Device Modules (Auto-Discovery)
Add new device types without touching palette code:
- Create `frontend/src/modules/deviceModules/newdevice.js` with export default `{ type, name, icon, defaultProps }`
- Vite `import.meta.globEager` auto-loads all `.js` files in that directory
- See `camera.js`, `light.js`, `sensor.js` for examples

### Dual Element System
- `elements[]` - HA entities (lights, switches, cameras with entity_id)
- `roomElements[]` - architectural (walls, doors, windows, zones)
- Both stored in Zustand; zones have `cssProperties` for custom styling

### Canvas Rendering (Fabric.js)
- Sensors render as `fabric.Group([circle, label])` - icon + text
- Zones have `hasControls: true` with draggable corner handles
- Snap-to-grid: `object:moving` event rounds `left/top` to `gridSize` multiples
- Each object has `elementId` property to link canvas ↔ store

### Backend Transformers
- `transformToLovelace(config)` - converts to `picture-elements` card (% coords)
- `transformToHaFloorplan(config)` - converts to `custom:floorplan-card`
- Canvas size: 800×600px → export uses `(pos/800*100)%` for responsive positioning

### HA API Integration
```javascript
// Backend auto-detects Supervisor context
const HA_URL = process.env.SUPERVISOR_URL || 'http://supervisor/core'
const HA_TOKEN = process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN

// Add card endpoint uses axios with Bearer token
axios.post(`${HA_URL}/api/lovelace/${dashboardPath}`, lovelaceConfig, {
  headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
})
```

## Key Files & Patterns

- `frontend/src/components/RoomCanvas.jsx` - drawing mode logic, snap-to-grid, zone creation
- `frontend/src/components/Toolbar.jsx` - z-order controls, export dropdown, "Add to Dashboard" dialog
- `frontend/src/components/PropertiesPanel.jsx` - CSS editor for zones (distinct from device properties)
- `backend/index.js` lines 130-250 - Lovelace integration endpoints
- `addon/config.json` - **VERSION HERE** controls HA update notifications

## Common Tasks

**Add new device type:**
1. Create `frontend/src/modules/deviceModules/yourtype.js`
2. Export object with `{ type: 'yourtype', name: 'Display Name', icon: HeroIcon, defaultProps: {...} }`
3. Restart frontend dev server → appears in palette automatically

**Add backend endpoint:**
- Place before `app.get('*', ...)` catch-all (serves frontend SPA)
- Use `HA_TOKEN` for authenticated HA API calls
- Return JSON errors with `res.status(500).json({ error, details })`

**Modify canvas behavior:**
- Edit `setupCanvasEvents(canvas)` in RoomCanvas.jsx
- Use `fabricObject.set({ prop: value })` then `canvas.renderAll()`
- Store changes via `updateElement(id, updates)` from Zustand

## Git Branching Strategy

- `main` → production-ready code
- `development` → active testing (updates HA development channel)
- `nightbuild` → auto-syncs with main on every push (bleeding edge)
- Tag `vX.Y.Z` → triggers release channel build

**Every commit must bump `addon/config.json` version** for HA to detect updates.
