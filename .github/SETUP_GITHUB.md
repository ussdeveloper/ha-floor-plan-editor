# GitHub Setup - Instrukcje krok po kroku

## 1. Utwórz repozytorium na GitHub

1. Przejdź do https://github.com/new
2. Nazwa repozytorium: `ha-floor-plan-editor` (lub dowolna)
3. Visibility: **Public** (wymagane dla Home Assistant repository)
4. **NIE** inicjalizuj z README, .gitignore ani LICENSE (już masz lokalnie)
5. Kliknij **Create repository**

## 2. Podłącz lokalne repozytorium do GitHub

GitHub pokaże instrukcje, wykonaj te komendy w terminalu:

```bash
# Zastąp YOUR_USERNAME swoją nazwą użytkownika GitHub
git remote add origin https://github.com/YOUR_USERNAME/ha-floor-plan-editor.git
git branch -M main
git push -u origin main
```

## 3. Utwórz dodatkowe branch-e

```bash
# Utwórz branch development
git checkout -b development
git push -u origin development

# Wróć na main
git checkout main
```

## 4. Skonfiguruj GitHub Actions

GitHub Actions workflow (`.github/workflows/build.yml`) zostanie automatycznie uruchomiony po push.

**Wymagane GitHub Secrets** (jeśli używasz prywatnego registry):
- Settings → Secrets and variables → Actions → New repository secret
- Dodaj sekret `GITHUB_TOKEN` (jeśli nie jest auto-generowany)

## 5. Dodaj repozytorium do Home Assistant

### Metoda 1: Przez UI (polecana)

1. W Home Assistant przejdź do **Settings** → **Add-ons** → **Add-on Store**
2. Kliknij **⋮** (3 kropki w prawym górnym rogu) → **Repositories**
3. Dodaj URL:
   ```
   https://github.com/YOUR_USERNAME/ha-floor-plan-editor
   ```
4. Kliknij **Add**
5. Odśwież stronę - zobaczysz addon w kategorii "Community Add-ons"

### Metoda 2: Przez configuration.yaml

Dodaj do `configuration.yaml`:

```yaml
hassio:
  repositories:
    - https://github.com/YOUR_USERNAME/ha-floor-plan-editor
```

Następnie:
1. Developer Tools → YAML → Restart Home Assistant Core
2. Settings → Add-ons → Add-on Store (odśwież)

## 6. Wybór kanału aktualizacji

Po dodaniu repozytorium, użytkownicy widzą 3 kanały:

- **ha-floor-plan-editor (release)** - stabilny
- **ha-floor-plan-editor (development)** - testy
- **ha-floor-plan-editor (nightbuild)** - eksperymentalne

Każdy kanał można zainstalować osobno i przełączać między nimi.

## 7. Test workflow

### Test nightbuild
```bash
# Każdy push do main triggeruje nightbuild
echo "test" >> README.md
git add README.md
git commit -m "test: trigger nightbuild"
git push origin main
```

Sprawdź: GitHub → Actions → Build add-on

### Test development
```bash
git checkout development
git merge main
git push origin development
```

### Test release
```bash
git checkout main
git tag v1.0.1
git push origin v1.0.1
```

## 8. Weryfikacja w Home Assistant

Po każdym build (GitHub Actions zakończy z sukcesem):

1. Settings → Add-ons → ⋮ → Reload
2. Sprawdź czy pojawia się nowa wersja dla odpowiedniego kanału
3. Kliknij **Update** aby zainstalować

## Troubleshooting

### Problem: "Repository not found" w HA

**Rozwiązanie:**
- Upewnij się że repozytorium jest **Public**
- Sprawdź czy URL jest poprawny
- Sprawdź czy `repository.json` jest w root directory

### Problem: Addon nie pojawia się w Store

**Rozwiązanie:**
- Sprawdź czy `addon/config.json` ma poprawną strukturę
- Sprawdź czy GitHub Actions build zakończył się sukcesem
- Odśwież repozytorium w HA: Add-ons → ⋮ → Reload

### Problem: GitHub Actions build fails

**Rozwiązanie:**
- Sprawdź logi w GitHub → Actions
- Upewnij się że wszystkie pliki są w repo
- Sprawdź czy `addon/Dockerfile` jest poprawny

### Problem: Aktualizacje nie są wykrywane

**Rozwiązanie:**
- Sprawdź czy zwiększyłeś wersję w `addon/config.json`
- Sprawdź czy build zakończył się dla odpowiedniego branch/tag
- Poczekaj kilka minut i odśwież: Add-ons → ⋮ → Reload

## Struktura plików dla HA Repository

```
ha-floor-plan-editor/
├── .github/
│   ├── workflows/
│   │   └── build.yml          # ✅ GitHub Actions
│   └── copilot-instructions.md
├── addon/
│   ├── config.json            # ✅ Addon manifest (WERSJA!)
│   ├── Dockerfile             # ✅ Container definition
│   └── run.sh                 # ✅ Startup script
├── backend/                   # ✅ Backend code
├── frontend/                  # ✅ Frontend code
├── repository.json            # ✅ Repository metadata
├── README.md                  # ✅ Documentation
├── LICENSE                    # ✅ MIT License
└── CHANGELOG.md              # ✅ Version history
```

Wszystkie wymagane pliki są już utworzone ✅

## Następne kroki

1. Utwórz repozytorium na GitHub (public)
2. Wykonaj komendy z sekcji 2
3. Wykonaj komendy z sekcji 3
4. Dodaj repozytorium w Home Assistant (sekcja 5)
5. Zainstaluj addon z wybranego kanału
6. Test i enjoy! 🎉
