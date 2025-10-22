# 🚀 Szybki Start - GitHub Setup

## Automatyczna instalacja (Polecana)

```powershell
.\setup-github.ps1
```

Ten skrypt automatycznie:
- Skonfiguruje remote repository GitHub
- Zaktualizuje URLs w `addon/config.json` i `repository.json`
- Push do `main` branch
- Utworzy i push `development` branch
- Wyświetli instrukcje dalszych kroków

## Manualna instalacja

### 1. Utwórz repo na GitHub

Przejdź do https://github.com/new i utwórz **public** repository o nazwie `ha-floor-plan-editor`

### 2. Podłącz lokalne repo

```powershell
# Zastąp YOUR_USERNAME swoją nazwą użytkownika
git remote add origin https://github.com/YOUR_USERNAME/ha-floor-plan-editor.git
git branch -M main
git push -u origin main
```

### 3. Utwórz development branch

```powershell
git checkout -b development
git push -u origin development
git checkout main
```

### 4. Zaktualizuj URLs

Edytuj:
- `addon/config.json` → zmień `"url"` na swoje GitHub repo
- `repository.json` → zmień `"url"` i `"maintainer"` na swoje dane

```powershell
git add addon/config.json repository.json
git commit -m "chore: update repository URLs"
git push
```

## Dodaj do Home Assistant

W Home Assistant:
1. **Settings** → **Add-ons** → **Add-on Store**
2. **⋮** (góra po prawej) → **Repositories**
3. Dodaj: `https://github.com/YOUR_USERNAME/ha-floor-plan-editor`
4. Kliknij **Add**

Po chwili zobaczysz addon w Store z 3 kanałami:
- **ha-floor-plan-editor** (release) - stabilny
- **ha-floor-plan-editor (development)** - testy
- **ha-floor-plan-editor (nightbuild)** - eksperymentalne

## Workflow

### Każda zmiana kodu:

```powershell
# 1. Zwiększ wersję w addon/config.json (WAŻNE!)
# 2. Commit i push
git add .
git commit -m "feat: twój opis"
git push origin main
```

→ **nightbuild** automatycznie się aktualizuje

### Update development:

```powershell
git checkout development
git merge main
git push origin development
git checkout main
```

→ **development** się aktualizuje

### Release:

```powershell
git tag v1.1.0
git push origin v1.1.0
```

→ **release** się aktualizuje

## Więcej informacji

- Szczegółowe instrukcje: `.github/SETUP_GITHUB.md`
- Kanały i workflow: `docs/RELEASE_CHANNELS.md`
- AI instrukcje: `.github/copilot-instructions.md`

## Troubleshooting

**"Repository not found"**
- Upewnij się że repo jest **Public**
- Sprawdź URL

**Addon nie pojawia się**
- Sprawdź GitHub Actions (czy build się powiódł)
- Odśwież: Add-ons → ⋮ → Reload

**Brak aktualizacji**
- Czy zwiększyłeś wersję w `addon/config.json`?
- Czy GitHub Actions build zakończył się sukcesem?
- Poczekaj 1-2 minuty i odśwież
