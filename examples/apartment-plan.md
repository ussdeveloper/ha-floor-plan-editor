# Przykład kompletnego planu mieszkania

```yaml
# examples/apartment-plan.yaml
name: "Mieszkanie 2-pokojowe"
created: "2025-10-22T10:00:00Z"
modified: "2025-10-22T12:30:00Z"

# Struktura pomieszczeń
roomElements:
  # Ściany zewnętrzne
  - id: "wall_1"
    type: "wall"
    name: "Ściana północna"
    x1: 50
    y1: 50
    x2: 350
    y2: 50
    strokeWidth: 15
    color: "#374151"
    
  - id: "wall_2"
    type: "wall" 
    name: "Ściana wschodnia"
    x1: 350
    y1: 50
    x2: 350
    y2: 250
    strokeWidth: 15
    color: "#374151"
    
  - id: "wall_3"
    type: "wall"
    name: "Ściana południowa"
    x1: 350
    y1: 250
    x2: 50
    y2: 250
    strokeWidth: 15
    color: "#374151"
    
  - id: "wall_4"
    type: "wall"
    name: "Ściana zachodnia"
    x1: 50
    y1: 250
    x2: 50
    y2: 50
    strokeWidth: 15
    color: "#374151"

  # Ściany wewnętrzne
  - id: "wall_internal_1"
    type: "wall"
    name: "Ściana sypialni"
    x1: 200
    y1: 50
    x2: 200
    y2: 150
    strokeWidth: 10
    color: "#374151"
    
  - id: "wall_internal_2"
    type: "wall"
    name: "Ściana łazienki"
    x1: 250
    y1: 150
    x2: 350
    y2: 150
    strokeWidth: 10
    color: "#374151"

  # Drzwi
  - id: "door_main"
    type: "door"
    name: "Drzwi główne"
    left: 90
    top: 245
    width: 80
    height: 10
    color: "#92400e"
    
  - id: "door_bedroom"
    type: "door"
    name: "Drzwi sypialni"
    left: 195
    top: 100
    width: 10
    height: 60
    color: "#92400e"
    
  - id: "door_bathroom"
    type: "door"
    name: "Drzwi łazienki"
    left: 270
    top: 145
    width: 60
    height: 10
    color: "#92400e"

  # Okna
  - id: "window_living"
    type: "window"
    name: "Okno salonu"
    left: 120
    top: 45
    width: 100
    height: 10
    color: "#1e40af"
    
  - id: "window_bedroom"
    type: "window"
    name: "Okno sypialni"
    left: 280
    top: 45
    width: 80
    height: 10
    color: "#1e40af"
    
  - id: "window_kitchen"
    type: "window"
    name: "Okno kuchni"
    left: 345
    top: 180
    width: 10
    height: 60
    color: "#1e40af"

# Pomieszczenia
rooms:
  - id: "room_living"
    name: "Salon"
    type: "living_room"
    color: "#fbbf24"
    bounds:
      x: 55
      y: 55
      width: 140
      height: 190
      
  - id: "room_bedroom"
    name: "Sypialnia"
    type: "bedroom"
    color: "#8b5cf6"
    bounds:
      x: 205
      y: 55
      width: 140
      height: 90
      
  - id: "room_kitchen"
    name: "Kuchnia"
    type: "kitchen"
    color: "#10b981"
    bounds:
      x: 205
      y: 155
      width: 140
      height: 90
      
  - id: "room_bathroom"
    name: "Łazienka"
    type: "bathroom"
    color: "#06b6d4"
    bounds:
      x: 255
      y: 155
      width: 90
      height: 90

# Urządzenia IoT
elements:
  # Salon
  - id: "light_living_main"
    type: "light"
    name: "Lampa główna salon"
    entity_id: "light.living_room_main"
    left: 125
    top: 150
    width: 30
    height: 30
    color: "#fbbf24"
    roomId: "room_living"
    clickAction: "toggle"
    
  - id: "tv"
    type: "switch"
    name: "Telewizor"
    entity_id: "switch.living_room_tv"
    left: 80
    top: 200
    width: 25
    height: 25
    color: "#374151"
    roomId: "room_living"
    clickAction: "toggle"
    
  - id: "motion_living"
    type: "sensor"
    name: "Czujnik ruchu salon"
    entity_id: "binary_sensor.living_room_motion"
    left: 160
    top: 120
    width: 20
    height: 20
    color: "#f59e0b"
    roomId: "room_living"
    clickAction: "more-info"

  # Sypialnia
  - id: "light_bedroom"
    type: "light"
    name: "Lampa sypialnia"
    entity_id: "light.bedroom_main"
    left: 275
    top: 100
    width: 25
    height: 25
    color: "#fbbf24"
    roomId: "room_bedroom"
    clickAction: "toggle"
    
  - id: "switch_bedroom_lamp"
    type: "switch"
    name: "Lampka nocna"
    entity_id: "switch.bedroom_bedside_lamp"
    left: 220
    top: 80
    width: 20
    height: 20
    color: "#f59e0b"
    roomId: "room_bedroom"
    clickAction: "toggle"

  # Kuchnia
  - id: "light_kitchen"
    type: "light"
    name: "Oświetlenie kuchni"
    entity_id: "light.kitchen_main"
    left: 275
    top: 200
    width: 25
    height: 25
    color: "#fbbf24"
    roomId: "room_kitchen"
    clickAction: "toggle"
    
  - id: "sensor_kitchen_temp"
    type: "sensor"
    name: "Temperatura kuchni"
    entity_id: "sensor.kitchen_temperature"
    left: 320
    top: 220
    width: 20
    height: 20
    color: "#ef4444"
    roomId: "room_kitchen"
    clickAction: "more-info"

  # Łazienka
  - id: "light_bathroom"
    type: "light"
    name: "Oświetlenie łazienki"
    entity_id: "light.bathroom_main"
    left: 300
    top: 180
    width: 20
    height: 20
    color: "#fbbf24"
    roomId: "room_bathroom"
    clickAction: "toggle"
    
  - id: "fan_bathroom"
    type: "switch"
    name: "Wentylator łazienkowy"
    entity_id: "switch.bathroom_fan"
    left: 280
    top: 200
    width: 20
    height: 20
    color: "#06b6d4"
    roomId: "room_bathroom"
    clickAction: "toggle"

# Konfiguracja eksportu
export:
  image: "/local/floorplan-apartment.svg"
  stylesheet: "/local/floorplan-apartment.css"
  entities_groups:
    lights:
      - light.living_room_main
      - light.bedroom_main
      - light.kitchen_main
      - light.bathroom_main
    switches:
      - switch.living_room_tv
      - switch.bedroom_bedside_lamp
      - switch.bathroom_fan
    sensors:
      - binary_sensor.living_room_motion
      - sensor.kitchen_temperature
```

## Użycie tego przykładu

1. Skopiuj powyższą konfigurację do nowego projektu w edytorze
2. Plan zostanie automatycznie odtworzony na kanwie
3. Dostosuj pozycje urządzeń według potrzeb
4. Zmapuj encje na swoje rzeczywiste urządzenia Home Assistant
5. Wyeksportuj gotową konfigurację do ha-floorplan

## Funkcje pokazane w przykładzie

- **Kompletny plan mieszkania** z ścianami, drzwiami i oknami
- **Zdefiniowane pomieszczenia** z różnymi typami i kolorami
- **Urządzenia IoT** pogrupowane według pomieszczeń
- **Różne typy akcji** (toggle, more-info)
- **Sensory i przełączniki** w odpowiednich lokalizacjach