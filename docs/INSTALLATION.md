# Przewodnik instalacji

## Wymagania systemowe

- Home Assistant OS lub Supervised
- HACS zainstalowany i skonfigurowany
- Co najmniej 512MB wolnej pamięci RAM
- 1GB wolnego miejsca na dysku

## Metoda 1: Instalacja przez HACS (Rekomendowana)

### Krok 1: Dodaj repozytorium

1. Otwórz HACS w Home Assistant
2. Przejdź do **HACS** → **Add-ons**
3. Kliknij **⋮** w prawym górnym rogu
4. Wybierz **Custom repositories**
5. Dodaj URL: `https://github.com/ussdeveloper/ha-floor-plan-editor`
6. Wybierz kategorię: **Add-on**
7. Kliknij **Add**

### Krok 2: Instalacja

1. Wyszukaj "HA Floor Plan Editor" w HACS
2. Kliknij **Download**
3. Poczekaj na zakończenie pobierania
4. Uruchom ponownie Home Assistant

### Krok 3: Konfiguracja

1. Przejdź do **Settings** → **Add-ons**
2. Znajdź "HA Floor Plan Editor"
3. Kliknij **Install**
4. Po instalacji kliknij **Start**
5. Opcjonalnie włącz **Start on boot**

## Metoda 2: Instalacja manualna

### Krok 1: Pobierz pliki

```bash
cd /usr/share/hassio/addons/local
git clone https://github.com/ussdeveloper/ha-floor-plan-editor.git
```

### Krok 2: Zainstaluj addon

1. Uruchom ponownie Home Assistant
2. Przejdź do **Settings** → **Add-ons**
3. Kliknij **⋮** → **Reload**
4. Znajdź "HA Floor Plan Editor" w sekcji **Local add-ons**
5. Kliknij **Install**

## Konfiguracja

### Podstawowa konfiguracja

```yaml
port: 3000
ssl: false
```

### Zaawansowana konfiguracja z SSL

```yaml
port: 3000
ssl: true
certfile: fullchain.pem
keyfile: privkey.pem
```

## Pierwszde uruchomienie

1. Po uruchomieniu addon'u otwórz **Web UI**
2. Lub przejdź ręcznie do `http://your-ha-ip:3000`
3. Powinieneś zobaczyć interfejs edytora

## Rozwiązywanie problemów

### Addon nie startuje

1. Sprawdź logi addon'u w **Log** tab
2. Upewnij się, że port 3000 nie jest używany przez inną aplikację
3. Sprawdź czy masz wystarczająco pamięci RAM

### Nie mogę połączyć się z interfejsem

1. Sprawdź czy addon jest uruchomiony
2. Sprawdź konfigurację portu
3. Sprawdź firewall/proxy settings

### Problemy z SSL

1. Upewnij się, że masz prawidłowe certyfikaty SSL
2. Sprawdź ścieżki do plików certyfikatów
3. Certyfikaty muszą być w folderze `/ssl/` w Home Assistant

## Aktualizacja

### Przez HACS

1. Przejdź do HACS → Add-ons
2. Znajdź "HA Floor Plan Editor"
3. Jeśli dostępna jest aktualizacja, kliknij **Update**

### Manualna

1. Przejdź do folderu addon'u
2. Wykonaj `git pull`
3. Uruchom ponownie addon

## Deinstalacja

1. Zatrzymaj addon w **Settings** → **Add-ons**
2. Kliknij **Uninstall**
3. Opcjonalnie usuń zapisane projekty z folderu `/config/ha-floor-plan-editor/`