# Przykłady konfiguracji

Ten folder zawiera przykładowe konfiguracje dla różnych typów planów pięter.

## Podstawowy plan salonu

```yaml
# examples/living-room.yaml
name: "Salon"
elements:
  - id: "light_main"
    type: "light"
    entity_id: "light.living_room_main"
    x: 200
    y: 150
    color: "#fbbf24"
    states:
      "on":
        color: "#fbbf24"
        opacity: 1
      "off":
        color: "#6b7280"
        opacity: 0.5
    
  - id: "tv"
    type: "switch" 
    entity_id: "switch.living_room_tv"
    x: 100
    y: 200
    color: "#10b981"
    click_action: "toggle"
```

## Plan całego domu

```yaml
# examples/whole-house.yaml
name: "Dom"
elements:
  - id: "entrance_light"
    type: "light"
    entity_id: "light.entrance"
    x: 50
    y: 50
    
  - id: "living_room_light"
    type: "light"
    entity_id: "light.living_room"
    x: 150
    y: 100
    
  - id: "kitchen_light"
    type: "light"
    entity_id: "light.kitchen"
    x: 250
    y: 100
    
  - id: "bedroom_light"
    type: "light"
    entity_id: "light.bedroom"
    x: 150
    y: 200
    
  - id: "motion_sensor"
    type: "sensor"
    entity_id: "binary_sensor.motion_living_room"
    x: 180
    y: 130
    color: "#f59e0b"
```

## Plan z czujnikami bezpieczeństwa

```yaml
# examples/security.yaml
name: "System bezpieczeństwa"
elements:
  - id: "door_sensor_front"
    type: "sensor"
    entity_id: "binary_sensor.door_front"
    x: 100
    y: 50
    states:
      "on":
        color: "#ef4444"
        opacity: 1
      "off":
        color: "#10b981"
        opacity: 1
        
  - id: "window_sensor_living"
    type: "sensor"
    entity_id: "binary_sensor.window_living_room"
    x: 200
    y: 100
    
  - id: "camera_entrance"
    type: "camera"
    entity_id: "camera.entrance"
    x: 80
    y: 80
    click_action: "more-info"
```

## Użycie z ha-floorplan

Po wyeksportowaniu z edytora, konfiguracja może być używana z ha-floorplan:

```yaml
# configuration.yaml
lovelace:
  mode: yaml
  resources:
    - url: /hacsfiles/ha-floorplan/floorplan.js
      type: module

# ui-lovelace.yaml
views:
  - title: Plan piętra
    cards:
      - type: custom:floorplan-card
        config: !include floorplan/living-room.yaml
```