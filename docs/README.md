# Dokumentacja HA Floor Plan Editor

## Spis treści

1. [Instalacja](#instalacja)
2. [Pierwsze kroki](#pierwsze-kroki)
3. [Interfejs użytkownika](#interfejs-użytkownika)
4. [Tworzenie planów](#tworzenie-planów)
5. [Integracja z Home Assistant](#integracja-z-home-assistant)
6. [Eksport konfiguracji](#eksport-konfiguracji)
7. [FAQ](#faq)

## Instalacja

### Poprzez HACS (Rekomendowane)

1. Otwórz HACS w Home Assistant
2. Przejdź do sekcji "Add-ons" 
3. Wyszukaj "HA Floor Plan Editor"
4. Kliknij "Install"
5. Uruchom ponownie Home Assistant
6. Przejdź do sekcji Add-ons i uruchom "HA Floor Plan Editor"

### Instalacja manualna

1. Skopiuj zawartość tego repozytorium do `addons/ha-floor-plan-editor`
2. Uruchom ponownie Home Assistant
3. Przejdź do sekcji Add-ons
4. Znajdź i zainstaluj "HA Floor Plan Editor"

## Pierwsze kroki

1. Po instalacji uruchom addon
2. Otwórz interfejs webowy (domyślnie http://your-ha-ip:3000)
3. Kliknij "Nowy projekt" aby rozpocząć
4. Dodawaj elementy przeciągając je z palety na kanwę
5. Konfiguruj właściwości w panelu po prawej stronie

## Interfejs użytkownika

### Paleta elementów (lewa strona)
- **Plan**: Narzędzia do rysowania planu pomieszczenia
  - Narzędzie wyboru i rysowania ścian
  - Ściany, drzwi, okna
  - Definicje pomieszczeń
- **Urządzenia**: Światła, przełączniki, czujniki, kamery
- **Kształty**: Podstawowe kształty geometryczne (w przyszłych wersjach)

### Kanwa (środek)
- Obszar roboczy do tworzenia planu
- Obsługuje przeciąganie i upuszczanie
- Siatka pomocnicza (opcjonalna)
- Kontrolki zoom i nawigacji

### Panel właściwości (prawa strona)
- Podstawowe właściwości: pozycja, rozmiar, obrót
- Wygląd: kolor, przezroczystość
- **Zarządzanie pomieszczeniami**: Definiowanie i organizacja pomieszczeń
- **Integracja HA**: mapowanie encji, akcje (tylko urządzenia)
- **Przypisanie do pomieszczeń**: Organizacja urządzeń według lokalizacji
- Konfiguracja stanów

### Pasek narzędzi (góra)
- Operacje na plikach: otwórz, zapisz
- Kontrolki edycji: cofnij, ponów (w przyszłych wersjach)
- Kontrolki zoom

## Tworzenie planów

### Rysowanie planu pomieszczenia

1. **Przygotowanie**:
   - Przejdź do zakładki "Plan" w palecie elementów
   - Wybierz narzędzie "Rysuj ścianę"
   - Kanwa przejdzie w tryb rysowania

2. **Rysowanie ścian**:
   - Kliknij i przeciągnij aby narysować ścianę
   - Ściany automatycznie łączą się w linie proste
   - Zakończ rysowanie wybierając narzędzie "Wybierz"

3. **Dodawanie drzwi i okien**:
   - Przeciągnij element "Drzwi" lub "Okno" z palety
   - Umieść na ścianie w odpowiednim miejscu
   - Dostosuj rozmiar w panelu właściwości

4. **Definiowanie pomieszczeń**:
   - Użyj narzędzia "Pomieszczenie" aby oznaczyć obszary
   - W panelu właściwości zarządzaj pomieszczeniami
   - Nadaj nazwy i wybierz typy pomieszczeń

### Dodawanie urządzeń IoT

1. Przejdź do zakładki "Urządzenia"
2. Przeciągnij urządzenie na plan
3. Umieść w odpowiednim pomieszczeniu
4. W panelu właściwości:
   - Przypisz encję Home Assistant
   - Wybierz pomieszczenie
   - Skonfiguruj akcje

### Edycja elementów

1. Wybierz element z palety po lewej stronie
2. Przeciągnij go na kanwę
3. Upuść w żądanej pozycji
4. Element zostanie automatycznie zaznaczony

### Edycja elementów

1. Kliknij na element aby go zaznaczyć
2. Użyj uchwytów do zmiany rozmiaru
3. Przeciągnij element aby zmienić pozycję
4. Obracaj używając uchwytu rotacji
5. Edytuj właściwości w panelu po prawej

### Usuwanie elementów

1. Zaznacz element
2. Kliknij ikonę kosza w panelu właściwości
3. Lub użyj klawisza Delete

## Integracja z Home Assistant

### Mapowanie encji

1. Zaznacz element na kanwie
2. W panelu właściwości wybierz "Encja"
3. Wybierz odpowiednią encję z listy rozwijanej
4. Skonfiguruj akcję po kliknięciu

### Akcje

- **Pokaż więcej informacji**: Otwiera standardowe okno HA z detalami encji
- **Przełącz stan**: Zmienia stan encji (włącz/wyłącz)
- **Przejdź do widoku**: Przekierowuje do określonego widoku
- **Wywołaj usługę**: Wykonuje określoną usługę HA

### Stany

W przyszłych wersjach będzie możliwa konfiguracja różnych stylów dla różnych stanów encji (np. różne kolory dla światła włączonego/wyłączonego).

## Eksport konfiguracji

### Eksport do ha-floorplan

1. Zakończ tworzenie planu
2. Zapisz projekt
3. Przejdź do listy projektów
4. Kliknij ikonę eksportu przy wybranym projekcie
5. Zostanie pobrany plik YAML kompatybilny z ha-floorplan

### Używanie wyeksportowanej konfiguracji

1. Umieść plik YAML w katalogu konfiguracji HA
2. Zainstaluj ha-floorplan przez HACS
3. Dodaj kartę floorplan do swojego dashboard'u
4. Wskaż ścieżkę do wyeksportowanego pliku

## FAQ

### Czy edytor jest kompatybilny z istniejącymi planami ha-floorplan?

Aktualnie edytor tworzy nowe plany. Importowanie istniejących konfiguracji planowane jest w przyszłych wersjach.

### Czy mogę używać własnych obrazów tła?

Ta funkcja jest planowana w przyszłych wersjach. Aktualnie edytor używa prostych kształtów.

### Jak mogę zgłosić błąd lub sugestię?

Przejdź do [Issues](https://github.com/ussdeveloper/ha-floor-plan-editor/issues) na GitHub i utwórz nowe zgłoszenie.

### Czy edytor działa na urządzeniach mobilnych?

Edytor jest zoptymalizowany dla urządzeń desktopowych. Obsługa mobilna będzie dodana w przyszłych wersjach.

### Gdzie są zapisywane projekty?

Projekty są zapisywane lokalnie w addon'ie w folderze `/data`. Możesz je również eksportować jako pliki YAML.

## Wsparcie

- [GitHub Issues](https://github.com/ussdeveloper/ha-floor-plan-editor/issues)
- [GitHub Discussions](https://github.com/ussdeveloper/ha-floor-plan-editor/discussions)
- [Home Assistant Community](https://community.home-assistant.io/)