import React, { useState } from 'react'
import { CogIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Settings = () => {
  const [settings, setSettings] = useState({
    autoSave: true,
    gridSnap: true,
    gridSize: 20,
    defaultZoom: 100,
    theme: 'light'
  })

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('editorSettings', JSON.stringify(settings))
    toast.success('Ustawienia zostały zapisane')
  }

  const handleReset = () => {
    const defaultSettings = {
      autoSave: true,
      gridSnap: true,
      gridSize: 20,
      defaultZoom: 100,
      theme: 'light'
    }
    setSettings(defaultSettings)
    toast.success('Ustawienia zostały zresetowane')
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center mb-6">
          <CogIcon className="w-8 h-8 mr-3 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Ustawienia</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main settings */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Ustawienia edytora</h2>
              </div>
              <div className="card-body space-y-6">
                {/* Auto save */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Automatyczne zapisywanie
                    </label>
                    <p className="text-sm text-gray-500">
                      Automatycznie zapisuj zmiany podczas pracy
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {/* Grid snap */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Przyciąganie do siatki
                    </label>
                    <p className="text-sm text-gray-500">
                      Automatycznie wyrównuj elementy do siatki
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.gridSnap}
                    onChange={(e) => setSettings({...settings, gridSnap: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {/* Grid size */}
                <div>
                  <label className="form-label">
                    Rozmiar siatki (px)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    value={settings.gridSize}
                    onChange={(e) => setSettings({...settings, gridSize: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>

                {/* Default zoom */}
                <div>
                  <label className="form-label">
                    Domyślne powiększenie (%)
                  </label>
                  <input
                    type="number"
                    min="25"
                    max="400"
                    step="25"
                    value={settings.defaultZoom}
                    onChange={(e) => setSettings({...settings, defaultZoom: parseInt(e.target.value)})}
                    className="form-input"
                  />
                </div>

                {/* Theme */}
                <div>
                  <label className="form-label">
                    Motyw
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({...settings, theme: e.target.value})}
                    className="form-input"
                  >
                    <option value="light">Jasny</option>
                    <option value="dark">Ciemny</option>
                    <option value="auto">Automatyczny</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Informacje</h3>
              </div>
              <div className="card-body">
                <div className="flex items-start">
                  <InformationCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Wersja:</strong> 1.0.0
                    </p>
                    <p className="mb-2">
                      <strong>Status:</strong> Eksperymentalna
                    </p>
                    <p>
                      Ten addon jest w fazie rozwoju. Zgłaszaj błędy i sugestie na GitHub.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Pomoc</h3>
              </div>
              <div className="card-body space-y-3">
                <a 
                  href="https://github.com/ussdeveloper/ha-floor-plan-editor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  📖 Dokumentacja
                </a>
                <a 
                  href="https://github.com/ussdeveloper/ha-floor-plan-editor/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  🐛 Zgłoś błąd
                </a>
                <a 
                  href="https://community.home-assistant.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-blue-600 hover:text-blue-800 text-sm"
                >
                  💬 Forum społeczności
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex space-x-4">
          <button onClick={handleSave} className="btn-primary">
            Zapisz ustawienia
          </button>
          <button onClick={handleReset} className="btn-secondary">
            Resetuj do domyślnych
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings