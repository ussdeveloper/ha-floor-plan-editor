# HA Floor Plan Editor

Edytor planów pięter dla Home Assistant - intuicyjne narzędzie do tworzenia i edycji interaktywnych planów pięter.

## Opis

HA Floor Plan Editor to addon dla Home Assistant, który umożliwia łatwe tworzenie i edycję interaktywnych planów pięter. Dzięki graficznemu interfejsowi użytkownicy mogą:

- Tworzyć plany pięter poprzez przeciąganie i upuszczanie elementów
- Mapować urządzenia Home Assistant na elementy planu
- Konfigurować stany i akcje dla elementów
- Eksportować gotowe konfiguracje do użycia z ha-floorplan

## Funkcje

- **Edytor planu pomieszczeń**: Proste narzędzia do rysowania ścian, drzwi i okien
- **Graficzny edytor**: Intuicyjny interfejs przeciągnij i upuść
- **Definicja pomieszczeń**: Tworzenie i nazywanie pomieszczeń
- **Integracja z HA**: Automatyczne wykrywanie urządzeń z Home Assistant
- **Podgląd na żywo**: Podgląd planu w czasie rzeczywistym
- **Eksport konfiguracji**: Generowanie YAML i CSS dla ha-floorplan
- **Szablony**: Gotowe szablony planów pięter
- **Responsywność**: Obsługa różnych rozmiarów ekranów

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

1. Zainstaluj i uruchom addon
2. Otwórz interfejs edytora w przeglądarce
3. Wybierz szablon lub zacznij od pustego planu
4. Dodaj elementy i zmapuj urządzenia
5. Skonfiguruj stany i akcje
6. Eksportuj konfigurację do ha-floorplan

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