# HA Floor Plan Editor - Wersjonowanie

## Jak działa wersjonowanie w Home Assistant

Home Assistant addons używają **prostego systemu wersji**:
- Każde repozytorium = **jeden addon**
- Wersja z `addon/config.json` jest wyświetlana użytkownikom
- Home Assistant wykrywa aktualizacje gdy wersja się zwiększy
- **Nie ma** wielu kanałów w jednym repozytorium (to jest tylko dla oficjalnych HA addons)

## Workflow deweloperski

### Każda zmiana kodu

```bash
# 1. Zaktualizuj wersję w addon/config.json
vim addon/config.json  # bump "version": "1.0.1" → "1.0.2"

# 2. Commit z konwencją conventional commits
git add .
git commit -m "feat: add new device module for thermostats"
# lub
git commit -m "fix: resolve snap-to-grid issue in RoomCanvas"

# 3. Push do main
git push origin main
```

**Rezultat**: GitHub Actions automatycznie:
- Buduje addon dla wszystkich architektur (armhf, armv7, aarch64, amd64, i386)
- Publikuje do repozytorium
- Użytkownicy widzą aktualizację w Home Assistant (po 2-3 minutach)

## Semantic Versioning

Format: `MAJOR.MINOR.PATCH` (np. `1.2.3`)

- **MAJOR**: Breaking changes (zmiana API, niekompatybilne zmiany)
- **MINOR**: Nowe funkcje (backward compatible)
- **PATCH**: Bugfixy (backward compatible)

### Przykłady

```
1.0.0 → 1.0.1  (bugfix: snap-to-grid)
1.0.1 → 1.1.0  (feature: add thermostat module)
1.1.0 → 2.0.0  (breaking: zmiana API backend)
```

## GitHub Actions Workflow

`.github/workflows/build.yml` automatycznie buduje addon przy każdym push do `main`:

1. Wykrywa commit do main branch
2. Buduje addon dla wszystkich architektur (armhf, armv7, aarch64, amd64, i386)
3. Publikuje do repozytorium
4. Użytkownicy widzą aktualizację w Home Assistant

## Home Assistant - detekcja aktualizacji

Home Assistant wykrywa aktualizacje porównując:
- Wersję zainstalowanego addonu
- Z wersją w `addon/config.json` w GitHub repo

**WAŻNE**: Zawsze zwiększaj wersję w `addon/config.json` przy każdym commit, inaczej HA nie wykryje aktualizacji!

## Testowanie lokalnie

Przed push do repo, przetestuj lokalnie:

```bash
# Backend
cd backend && npm install && node index.js

# Frontend (nowe okno terminala)
cd frontend && npm install && npm run dev

# Docker build test
docker build -t ha-floor-plan-editor .
docker run -p 3000:3000 ha-floor-plan-editor
```

## Troubleshooting

**Problem**: Home Assistant nie widzi aktualizacji

**Rozwiązanie**: 
- Sprawdź czy wersja w `addon/config.json` została zwiększona
- Sprawdź czy GitHub Actions build zakończył się sukcesem
- Odśwież repozytorium w HA: Add-ons → ⋮ → Reload

**Problem**: Build się nie udał

**Rozwiązanie**:
- Sprawdź logi GitHub Actions
- Upewnij się że wszystkie zależności są w `package.json`
- Sprawdź czy `addon/config.json` jest poprawnym JSON

## Best Practices

1. **Zawsze testuj lokalnie** przed push
2. **Zwiększaj wersję** przy każdym commit
3. **Używaj conventional commits** (`feat:`, `fix:`, `docs:`, itp.)
4. **Testuj w nightbuild** przed merge do development
5. **Testuj w development** przed release tag
6. **Taguj release** tylko dla stabilnego kodu
