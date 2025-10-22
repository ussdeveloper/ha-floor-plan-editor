# HA Floor Plan Editor - Multi-Channel Releases

## Kanały aktualizacji

Projekt używa trzech kanałów aktualizacji dla różnych grup użytkowników:

### 1. **nightbuild** (Eksperymentalne)
- **Aktualizacja**: Automatycznie przy każdym commit do `main`
- **Dla kogo**: Deweloperzy i entuzjaści testujący najnowsze zmiany
- **Stabilność**: Może zawierać niestabilny kod
- **Wersja**: Auto-increment przy każdym build (patch)

### 2. **development** (Testy)
- **Aktualizacja**: Ręczne merge z `main` do `development` branch
- **Dla kogo**: Early adopters testujący nowe funkcje
- **Stabilność**: Zweryfikowane zmiany, ale jeszcze nie w pełni przetestowane
- **Wersja**: Minor/patch increment

### 3. **release** (Stabilny)
- **Aktualizacja**: Przy tagowaniu release (`v*.*.*`)
- **Dla kogo**: Użytkownicy produkcyjni
- **Stabilność**: Pełne testy, stabilny kod
- **Wersja**: Semantic versioning (major.minor.patch)

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
- Buduje addon dla wszystkich architektur
- Publikuje do kanału **nightbuild**
- Użytkownicy nightbuild widzą aktualizację w Home Assistant

### Aktualizacja development

```bash
# Gdy zmiany są zweryfikowane w nightbuild:
git checkout development
git merge main
git push origin development
```

**Rezultat**: 
- Build publikowany do kanału **development**
- Użytkownicy development widzą aktualizację

### Release (stabilny)

```bash
# Gdy development jest stabilny:
git checkout main
git tag v1.1.0
git push origin v1.1.0
```

**Rezultat**: 
- Build publikowany do kanału **release**
- Użytkownicy release widzą aktualizację

## Home Assistant - detekcja aktualizacji

Home Assistant śledzi wersję z `addon/config.json` dla każdego kanału osobno:

- Użytkownik na kanale **nightbuild** widzi aktualizację gdy wersja w nightbuild > zainstalowana wersja
- Użytkownik na kanale **development** widzi aktualizację gdy wersja w development > zainstalowana wersja
- Użytkownik na kanale **release** widzi aktualizację gdy wersja w release > zainstalowana wersja

**WAŻNE**: Zawsze zwiększaj wersję w `addon/config.json` przy każdym commit, inaczej HA nie wykryje aktualizacji!

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

`.github/workflows/build.yml` automatycznie:

1. Wykrywa branch/tag
2. Określa kanał:
   - `main` branch → **nightbuild**
   - `development` branch → **development**
   - tag `v*.*.*` → **release**
3. Buduje addon dla wszystkich architektur (armhf, armv7, aarch64, amd64, i386)
4. Publikuje do odpowiedniego kanału

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
