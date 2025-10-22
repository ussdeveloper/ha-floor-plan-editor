# HA Floor Plan Editor - AI Agent Instructions

## Architecture Overview

This is a **Home Assistant addon** with a React frontend + Express backend that creates interactive floor plans for smart home dashboards.

**Multi-addon structure (like ESPHome):**
- `floor-plan-editor/` - **Stable** releases (version 1.0.x, stage: stable)
- `floor-plan-editor-beta/` - **Beta** releases (version 1.1.x-beta, new features)
- `floor-plan-editor-dev/` - **Development** builds (version dev-YYYYMMDD, experimental)

Each folder is a **separate addon** in Home Assistant Store from single repository!

**Key components:**
- `backend/index.js` - Express API server with WebSocket support, HA API integration via Supervisor
- `frontend/` - Vite + React SPA using Fabric.js for canvas drawing
- `floor-plan-editor*/` - Three addon variants (stable/beta/dev) with different `config.json`
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
**CRITICAL**: Multi-addon structure means updating versions in multiple places:

**Workflow for each channel:**

1. **Stable (floor-plan-editor/)** - production releases
   - Update `floor-plan-editor/config.json` → bump version (1.0.1 → 1.0.2)
   - Commit: `git commit -m "release: v1.0.2"`
   - Push → GitHub Actions builds stable addon
   
2. **Beta (floor-plan-editor-beta/)** - new features testing
   - Update `floor-plan-editor-beta/config.json` → bump version (1.1.0-beta1 → 1.1.0-beta2)
   - Commit: `git commit -m "beta: v1.1.0-beta2 - new feature"`
   - Push → GitHub Actions builds beta addon
   
3. **Dev (floor-plan-editor-dev/)** - experimental/daily builds
   - Update `floor-plan-editor-dev/config.json` → version format: `dev-YYYYMMDD`
   - Auto-updates on every commit to main
   - Commit: `git commit -m "dev: experimental feature"`
   - Push → GitHub Actions builds dev addon

**Important:**
- Each addon has **independent versioning**
- Users see 3 separate addons in HA Store from ONE repository
- Stable upgrades: 1.0.x → 1.0.y (bugfixes only)
- Beta upgrades: 1.1.x-betaN (new features before stable)
- Dev upgrades: dev-YYYYMMDD (bleeding edge, daily)

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
- `floor-plan-editor/config.json` - **STABLE VERSION HERE** controls HA update notifications
- `floor-plan-editor-beta/config.json` - **BETA VERSION HERE** 
- `floor-plan-editor-dev/config.json` - **DEV VERSION HERE** (format: dev-YYYYMMDD)

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

## Multi-Addon Repository Structure

Home Assistant **automatically detects** all folders with `config.json` as separate addons:

```
ha-floor-plan-editor/
├── floor-plan-editor/          ← Stable addon (1.0.x)
│   ├── config.json
│   ├── Dockerfile
│   └── run.sh
├── floor-plan-editor-beta/     ← Beta addon (1.1.x-beta)
│   ├── config.json
│   ├── Dockerfile
│   └── run.sh
├── floor-plan-editor-dev/      ← Dev addon (dev-YYYYMMDD)
│   ├── config.json
│   ├── Dockerfile
│   └── run.sh
├── backend/                    ← Shared codebase
├── frontend/                   ← Shared codebase
├── repository.json
└── .github/workflows/build.yml ← Builds all 3 addons
```

**GitHub Actions** builds **3 separate jobs** (build-stable, build-beta, build-dev) targeting each folder.

Users in HA see:
- "HA Floor Plan Editor" (stable)
- "HA Floor Plan Editor (Beta)" (beta features)
- "HA Floor Plan Editor (Dev)" (experimental)

Each can be installed independently!

## Git Branching Strategy

- `main` → production-ready code
- `development` → active testing (optional for pre-release testing)
- Addon versions controlled in each `floor-plan-editor*/config.json`

**Every commit must bump version in appropriate addon config.json** for HA to detect updates.

**Release process:**
1. Feature development → update dev addon version → push
2. When stable → update beta addon version → push
3. When fully tested → update stable addon version → push
