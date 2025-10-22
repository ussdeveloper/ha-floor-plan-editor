# GitHub Setup Script for HA Floor Plan Editor
# Wykonaj ten skrypt aby automatycznie skonfigurować GitHub repository

Write-Host "=== HA Floor Plan Editor - GitHub Setup ===" -ForegroundColor Cyan
Write-Host ""

# 1. Sprawdź czy mamy remote
$remote = git remote -v 2>$null
if ($remote) {
    Write-Host "✓ Remote repository już skonfigurowane:" -ForegroundColor Green
    git remote -v
    Write-Host ""
} else {
    Write-Host "? Nie znaleziono zdalnego repozytorium" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Proszę podać URL do GitHub repository:" -ForegroundColor Cyan
    Write-Host "Format: https://github.com/YOUR_USERNAME/ha-floor-plan-editor.git" -ForegroundColor Gray
    $githubUrl = Read-Host "GitHub URL"
    
    if ($githubUrl) {
        Write-Host "Dodaję remote origin..." -ForegroundColor Cyan
        git remote add origin $githubUrl
        
        # Wyciągnij username z URL
        if ($githubUrl -match "github\.com[:/]([^/]+)/") {
            $username = $matches[1]
            
            # Zaktualizuj addon/config.json
            Write-Host "Aktualizuję addon/config.json..." -ForegroundColor Cyan
            $configPath = "addon\config.json"
            $config = Get-Content $configPath -Raw | ConvertFrom-Json
            $config.url = "https://github.com/$username/ha-floor-plan-editor"
            $config | ConvertTo-Json -Depth 10 | Set-Content $configPath
            
            # Zaktualizuj repository.json
            Write-Host "Aktualizuję repository.json..." -ForegroundColor Cyan
            $repoPath = "repository.json"
            $repo = Get-Content $repoPath -Raw | ConvertFrom-Json
            $repo.url = "https://github.com/$username/ha-floor-plan-editor"
            $repo.maintainer = $username
            $repo | ConvertTo-Json -Depth 10 | Set-Content $repoPath
            
            # Commit zmian
            git add addon\config.json repository.json
            git commit -m "chore: update repository URLs to actual GitHub account"
            
            Write-Host "✓ URLs zaktualizowane" -ForegroundColor Green
        }
        
        Write-Host "✓ Remote dodany" -ForegroundColor Green
    } else {
        Write-Host "! Anulowano" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=== Push do GitHub ===" -ForegroundColor Cyan

# 2. Push main branch
Write-Host "Pushing main branch..." -ForegroundColor Cyan
git branch -M main
git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Main branch pushed" -ForegroundColor Green
} else {
    Write-Host "! Push failed - sprawdź czy masz dostęp do repo" -ForegroundColor Red
    Write-Host "  Jeśli to pierwsze push, może być potrzebna autoryzacja GitHub" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== Tworzę branch development ===" -ForegroundColor Cyan

# 3. Utwórz i push development branch
$currentBranch = git branch --show-current
git checkout -b development 2>$null
if ($LASTEXITCODE -ne 0) {
    # Branch już istnieje
    git checkout development
}

git push -u origin development 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Development branch created and pushed" -ForegroundColor Green
} else {
    Write-Host "! Development push failed" -ForegroundColor Red
}

# Wróć na main
git checkout main

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Następne kroki:" -ForegroundColor Cyan
Write-Host "1. Przejdź do GitHub Actions i sprawdź czy build się rozpoczął" -ForegroundColor White
Write-Host "2. W Home Assistant dodaj repozytorium:" -ForegroundColor White
$repoJson = Get-Content "repository.json" -Raw | ConvertFrom-Json
Write-Host "   $($repoJson.url)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Po zakończeniu build, odśwież Add-on Store i zainstaluj addon" -ForegroundColor White
Write-Host ""
Write-Host "Dostępne kanały:" -ForegroundColor Cyan
Write-Host "  • nightbuild   - auto-update przy każdym commit do main" -ForegroundColor Gray
Write-Host "  • development  - push do development branch" -ForegroundColor Gray
Write-Host "  • release      - tag release (np. v1.0.1)" -ForegroundColor Gray
Write-Host ""
Write-Host "Dokumentacja: .github\SETUP_GITHUB.md" -ForegroundColor Gray
Write-Host ""
