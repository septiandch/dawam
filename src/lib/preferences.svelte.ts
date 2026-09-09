export const preferences = $state({
  darkMode: false,
  showTransliteration: true,
  showTranslation: true,
  arabicFontScale: 'md',
});

export function loadPreferences() {
  preferences.darkMode = document.documentElement.classList.contains('dark');
  try {
    const storedPreferences = JSON.parse(localStorage.getItem('dawam-preferences') || '{}');

    if (typeof storedPreferences.showTransliteration === 'boolean') {
      preferences.showTransliteration = storedPreferences.showTransliteration;
    }

    if (typeof storedPreferences.showTranslation === 'boolean') {
      preferences.showTranslation = storedPreferences.showTranslation;
    }

    if (['sm', 'md', 'lg'].includes(storedPreferences.arabicFontScale)) {
      preferences.arabicFontScale = storedPreferences.arabicFontScale;
    }
  } catch {
    // Keep the defaults if storage is unavailable or the saved JSON is invalid.
  }
}

export function savePreferences() {
  try {
    localStorage.setItem('dawam-preferences', JSON.stringify(preferences));
  } catch {
    // Preferences still work in memory when storage is unavailable.
  }
}
