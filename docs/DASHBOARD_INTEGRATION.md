# Dodawanie karty Floor Plan do Dashboard z poziomu edytora

## Funkcjonalność

Addon pozwala teraz bezpośrednio dodać kartę floor plan do dashboardu Lovelace bez ręcznego kopiowania YAML.

## Jak to działa

### 1. Przycisk "Dodaj do Dashboard"

W toolbarze edytora (obok przycisku "Eksportuj") znajduje się zielony przycisk **"Dodaj do Dashboard"**.

### 2. Dialog konfiguracji

Po kliknięciu przycisku pojawia się okno dialogowe z opcjami:

- **Dashboard**: wybór dashboardu (`lovelace` = domyślny dashboard)
- **Widok (View Index)**: numer widoku, do którego zostanie dodana karta
  - `0` = pierwszy widok (tab)
  - `1` = drugi widok
  - itd.
- **Format karty**: 
  - `Lovelace Picture-Elements` (natywna karta HA)
  - `HA Floorplan Card` (custom card)

### 3. Automatyczne dodanie

Po zatwierdzeniu:
1. Addon generuje konfigurację karty na podstawie projektu
2. Łączy się z Home Assistant API (przez Supervisor)
3. Pobiera aktualną konfigurację wybranego dashboardu
4. Dodaje nową kartę do wybranego widoku
5. Zapisuje zaktualizowaną konfigurację

Dashboard zostaje natychmiast zaktualizowany - wystarczy odświeżyć stronę Lovelace.

## Backend API

### Nowe endpointy

#### `POST /api/floorplan/:name/add-to-dashboard`

Dodaje kartę do dashboardu.

**Request body:**
```json
{
  "dashboardPath": "lovelace",
  "viewIndex": 0,
  "format": "lovelace"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Floor plan card added to dashboard",
  "dashboard": "lovelace",
  "view": 0,
  "cardIndex": 5
}
```

#### `GET /api/lovelace/dashboards`

Pobiera listę dostępnych dashboardów.

**Response:**
```json
[
  {
    "path": "lovelace",
    "title": "Default Dashboard"
  }
]
```

## Wymagania

### Zmienne środowiskowe

Addon automatycznie używa zmiennych środowiskowych z Supervisor:

- `SUPERVISOR_URL` - URL do Supervisor API
- `SUPERVISOR_TOKEN` - token autoryzacji

W przypadku uruchomienia poza Home Assistant addon można ustawić:

- `HA_URL` - URL do Home Assistant (np. `http://homeassistant:8123`)
- `HA_TOKEN` - długoterminowy token dostępu (long-lived access token)

### Uprawnienia

Addon wymaga dostępu do:
- `homeassistant_api: true` - już skonfigurowane w `addon/config.json`
- `hassio_api: true` - już skonfigurowane

## Bezpieczeństwo

- Komunikacja przez wewnętrzne API Supervisor (nie przez sieć)
- Token autoryzacji przekazywany automatycznie przez Supervisor
- Walidacja danych wejściowych (dashboard path, view index)

## Ograniczenia

- Obecnie wspiera tylko domyślny dashboard (`lovelace`)
- Nie wspiera dashboardów w trybie YAML (tylko UI mode)
- Nie można wybrać konkretnej pozycji karty (zawsze dodawana na końcu widoku)

## Rozszerzenia (TODO)

Możliwe usprawnienia:

1. **Lista wszystkich dashboardów** - wykrywanie custom dashboards
2. **Podgląd widoków** - pokazanie nazw widoków zamiast indeksów
3. **Pozycja karty** - wybór konkretnego miejsca w widoku
4. **Aktualizacja istniejącej karty** - jeśli karta już istnieje, zaktualizuj ją zamiast dodawać nową
5. **Podgląd YAML** - pokazanie wygenerowanego YAML przed dodaniem

## Przykład użycia

1. Otwórz edytor floor plan
2. Zaprojektuj plan (dodaj urządzenia, strefy, itp.)
3. Zapisz projekt (przycisk "Zapisz")
4. Kliknij **"Dodaj do Dashboard"**
5. Wybierz:
   - Dashboard: `lovelace`
   - Widok: `0` (pierwszy widok)
   - Format: `Lovelace Picture-Elements`
6. Kliknij **"Dodaj kartę"**
7. Odśwież dashboard Lovelace w Home Assistant
8. Karta floor plan pojawi się w wybranym widoku!
