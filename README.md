# HA Floor Plan Editor

Edytor planów pięter dla Home Assistant - intuicyjne narzędzie do tworzenia i edycji interaktywnych planów pięter.

## Opis

HA Floor Plan Editor to addon dla Home Assistant, który umożliwia łatwe tworzenie i edycję interaktywnych planów pięter. Dzięki graficznemu interfejsowi użytkownicy mogą:

- Tworzyć plany pięter poprzez przeciąganie i upuszczanie elementów
- Mapować urządzenia Home Assistant na elementy planu
- Konfigurować stany i akcje dla elementów
- Eksportować gotowe konfiguracje do użycia z ha-floorplan

## Funkcje

### Edytor planu pomieszczeń
- **Rysowanie ścian**: Tryb rysowania z podglądem na żywo
- **Drzwi i okna**: Przeciągnij i upuść elementy architektoniczne
- **Strefy**: Definiowanie obszarów z niestandardowym CSS
- **Pomieszczenia**: Nazywanie i organizowanie przestrzeni

### Urządzenia Home Assistant
- **Światła**: Ikony świateł z mapowaniem encji
- **Przełączniki**: Kontrola przełączników
- **Czujniki**: Ikona + etykieta dla czujników
- **Kamery**: Ikony kamer na planie

### Edycja i układ
- **Snap to grid**: Przyciąganie do siatki z regulowaną rozdzielczością
- **Z-order controls**: Bring to front/back, forward/backward dla każdego elementu
- **Właściwości CSS**: Pełna kontrola stylów dla stref (background, border, opacity, etc.)
- **Przeciągnij i upuść**: Intuicyjne pozycjonowanie elementów
- **Zoom**: 25%-400% z płynną skalą

### Eksport
- **Lovelace Picture-Elements**: Eksport do natywnego dashboardu HA z zachowanymi pozycjami
- **HA Floorplan Card**: Kompatybilność z custom:floorplan-card
- **Dodaj do Dashboard**: Bezpośrednie dodawanie karty do Lovelace z poziomu edytora (1-klik)
- **Dokładne pozycje**: Wszystkie współrzędne przeliczane procentowo

### Integracja
- **Automatyczne wykrywanie encji**: Pobieranie z Home Assistant API
- **WebSocket**: Aktualizacje w czasie rzeczywistym
- **Addon z UI**: Eksponowany na HTTP (domyślnie port 3000)
- **Ingress support**: Bezpieczny dostęp przez Home Assistant UI

## Instalacja

### Poprzez HACS (Rekomendowane)

1. Otwórz HACS w Home Assistant
2. Przejdź do sekcji "Add-ons"
3. Wyszukaj "HA Floor Plan Editor"
4. Kliknij "Install"

### Instalacja manualna

1. Skopiuj zawartość tego repozytorium do katalogu `addons/ha-floor-plan-editor` w Home Assistant
2. Uruchom ponownie Home Assistant
3. Przejdź do sekcji Add-ons i zainstaluj "HA Floor Plan Editor"

## Użytkowanie

### Podstawowe kroki
1. Zainstaluj i uruchom addon w Home Assistant
2. Otwórz interfejs edytora (via Ingress lub http://[HOST]:3000)
3. Wybierz szablon lub zacznij od pustego planu

### Rysowanie planu
1. **Wybierz zakładkę "Plan"** w palecie elementów (lewa strona)
2. **Kliknij "Rysuj ścianę"** aby aktywować tryb rysowania
3. **Kliknij i przeciągnij** na canvasie aby narysować ścianę
4. **Przeciągnij drzwi/okna** z palety na plan
5. **Dodaj strefy** dla definiowania obszarów

### Dodawanie urządzeń
1. **Przejdź do zakładki "Urządzenia"**
2. **Przeciągnij ikony** (światła, przełączniki, czujniki, kamery) na canvas
3. **Wybierz element** i w panelu właściwości (prawa strona) przypisz encję HA
4. **Skonfiguruj akcje** (toggle, more-info, etc.)

### Edycja
- **Snap to grid**: Zaznacz checkbox "Przyciągaj do siatki" w toolbarze
- **Z-order**: Wybierz element → użyj przycisków strzałek w toolbarze (na wierzch/na spód)
- **CSS dla stref**: Wybierz strefę → sekcja "Style CSS" w właściwościach
- **Zoom**: Użyj przycisków +/- lub kliknij wartość zoom aby zresetować

### Eksport
1. **Zapisz projekt** (przycisk "Zapisz")
2. **Opcja 1 - Dodaj bezpośrednio do Dashboard**:
   - Kliknij **"Dodaj do Dashboard"** (zielony przycisk)
   - Wybierz dashboard i widok (view index)
   - Wybierz format karty
   - Kliknij "Dodaj kartę" → karta pojawi się natychmiast w Lovelace!
3. **Opcja 2 - Pobierz YAML**:
   - Kliknij **"Eksportuj"** w toolbarze
   - Wybierz format:
     - **Lovelace Picture-Elements** - dla natywnego dashboardu HA
     - **HA Floorplan Card** - dla custom:floorplan-card
   - Pobierz YAML i dodaj ręcznie do konfiguracji Lovelace

## Rozwój

### Wymagania

- Node.js 18+
- npm lub yarn
- Docker (do budowania addonu)

### Lokalne uruchomienie

```bash
# Klonowanie repozytorium
git clone https://github.com/ussdeveloper/ha-floor-plan-editor
cd ha-floor-plan-editor

# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev

# Budowanie na produkcję
npm run build
```

### Struktura projektu

```
├── addon/              # Konfiguracja addonu HA
├── frontend/           # Aplikacja React/Vue
├── backend/            # Serwer Node.js
├── docs/              # Dokumentacja
├── examples/          # Przykłady konfiguracji
└── docker/            # Konfiguracja Docker
```

## Przyczynianie się do rozwoju

1. Forkuj repozytorium
2. Stwórz branch dla swojej funkcji (`git checkout -b feature/new-feature`)
3. Commituj zmiany (`git commit -am 'Add some feature'`)
4. Pushuj do brancha (`git push origin feature/new-feature`)
5. Otwórz Pull Request

## Licencja

Ten projekt jest licencjonowany pod licencją MIT - zobacz plik [LICENSE](LICENSE) dla szczegółów.

## Wsparcie

- [Issues](https://github.com/ussdeveloper/ha-floor-plan-editor/issues) - zgłaszanie błędów i sugestii
- [Discussions](https://github.com/ussdeveloper/ha-floor-plan-editor/discussions) - dyskusje i pomoc
- [Home Assistant Community](https://community.home-assistant.io/) - wsparcie społeczności

## Credits

- Bazuje na [ha-floorplan](https://github.com/ExperienceLovelace/ha-floorplan)
- Ikony z [Material Design Icons](https://materialdesignicons.com/)
- UI framework: React/Vue.js