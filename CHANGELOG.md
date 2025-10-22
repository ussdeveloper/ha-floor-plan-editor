# HA Floor Plan Editor - Changelog

## [Unreleased]

### Added
- **Camera module**: New device type for cameras with icon and state handling
- **Snap to grid**: Adjustable grid snapping during element placement and movement
  - Configurable grid resolution (gridSize)
  - Toggle in toolbar (checkbox "Przyciągaj do siatki")
- **Zone drawing**: New zone element type for defining areas on the floor plan
  - Draggable corner handles for resizing
  - CSS property editor for zones (background, border, border-radius, custom CSS)
- **Z-order controls**: Toolbar buttons for changing element stacking order
  - Bring to front / Send to back
  - Bring forward / Send backward
  - Visible when an element is selected
- **Lovelace export**: Export to picture-elements card format
  - Exact position preservation (percentage-based coordinates)
  - Support for device elements and zones
  - Icon mapping for all device types
- **Modular device system**: Auto-discovery of device modules
  - Device modules in `frontend/src/modules/deviceModules/`
  - Add new device by creating a file (no need to edit palette)
  - Documentation in `frontend/src/modules/deviceModules/README.md`

### Changed
- **Toolbar**: Added z-order controls and snap-to-grid toggle
- **Export dropdown**: Export button now offers both Lovelace and HA Floorplan formats
- **Canvas**: Objects snap to grid when snap-to-grid is enabled
- **Store**: Added `snapToGrid` state and z-order action methods

### Fixed
- Sensor rendering now shows icon + label as a grouped object

---

## [1.0.0] - Initial Release

### Added
- Basic floor plan editor with drag-and-drop
- Room drawing tools (walls, doors, windows, rooms)
- Device palette (lights, switches, sensors)
- Properties panel for editing element attributes
- Backend API for save/load/export
- WebSocket support for real-time updates
- Home Assistant addon configuration
- Docker and docker-compose setup
- Documentation and examples
