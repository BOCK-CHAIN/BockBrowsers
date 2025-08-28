// --- Settings Page Logic ---

import { getUserSettings, saveUserSettings } from '../api.js';

// Show a section and mark the corresponding button active
function showSection(id, button) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.sidebar button').forEach(btn => {
    btn.classList.remove('active');
    btn.removeAttribute('aria-current');
  });

  button.classList.add('active');
  button.setAttribute('aria-current', 'page');
}

// Filter sidebar menu buttons based on search
function filterMenu(query) {
  const lowerQuery = query.toLowerCase();
  document.querySelectorAll('.sidebar button').forEach(btn => {
    const text = btn.textContent.toLowerCase();
    btn.style.display = text.includes(lowerQuery) ? 'flex' : 'none';
  });
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('light-theme');
      themeToggle.setAttribute('aria-checked', 'true');
    } else {
      document.body.classList.remove('light-theme');
      themeToggle.setAttribute('aria-checked', 'false');
    }
    saveSettings();
  });
}

// Reset all settings to default
function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    document.querySelectorAll('form').forEach(form => form.reset());
    if (themeToggle) {
      themeToggle.checked = false;
      document.body.classList.remove('light-theme');
      themeToggle.setAttribute('aria-checked', 'false');
    }
    saveSettings();
    alert('Settings have been reset.');
  }
}

// Navigate back to home/index.html
function goHome() {
  if (window.electronAPI && window.electronAPI.navigateTo) {
    window.electronAPI.navigateTo('home');
  } else {
    console.warn('Electron API navigateTo not available');
  }
}

// Expose goHome to the global scope
// window.goHome = goHome;
// window.filterMenu = filterMenu;
// window.resetSettings = resetSettings;

// --- NEW: Load and Save User Settings ---
async function loadSettings() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!currentUser.userId) return;

  try {
    const userSettings = await getUserSettings(currentUser.userId);
    console.log("User settings received from API:", userSettings);
    console.log("Default search from settings:", userSettings?.defaultSearch);
    console.log("Language select from settings:", userSettings?.languageSelect);
    if (!userSettings) return;

    // Apply saved settings
    if (userSettings.theme === "light") {
      themeToggle.checked = true;
      document.body.classList.add('light-theme');
      themeToggle.setAttribute('aria-checked', 'true');
    } else {
      themeToggle.checked = false;
      document.body.classList.remove('light-theme');
      themeToggle.setAttribute('aria-checked', 'false');
    }

    if (userSettings.fontSize) {
      document.getElementById('font-size').value = userSettings.fontSize;
      document.body.style.fontSize = userSettings.fontSize === "small" ? "0.8em" : userSettings.fontSize === "large" ? "1.2em" : "1em";
    }

    // Add more fields as needed
    if (userSettings.hardwareAcceleration !== undefined) {
      document.getElementById('hardware-acceleration').checked = userSettings.hardwareAcceleration;
    }
    if (userSettings.memoryLimit) {
      document.getElementById('memory-limit').value = userSettings.memoryLimit;
    }
    if (userSettings.defaultSearch) {
      console.log(`Attempting to set default search to: ${userSettings.defaultSearch}`);
      const defaultSearchElement = document.getElementById('default-search');
      if (defaultSearchElement) {
        // Iterate through options and set 'selected' attribute directly
        Array.from(defaultSearchElement.options).forEach((option, index) => {
          if (option.value === userSettings.defaultSearch) {
            defaultSearchElement.selectedIndex = index;
            option.selected = true;
          } else {
            option.selected = false;
          }
        });
        console.log(`Default search element value after setting: ${defaultSearchElement.value}`);
        defaultSearchElement.dispatchEvent(new Event('change')); // Dispatch change event
      }
    }
    if (userSettings.languageSelect) {
      console.log(`Attempting to set language select to: ${userSettings.languageSelect}`);
      const languageSelectElement = document.getElementById('language-select');
      if (languageSelectElement) {
        // Iterate through options and set 'selected' attribute directly
        Array.from(languageSelectElement.options).forEach((option, index) => {
          if (option.value === userSettings.languageSelect) {
            languageSelectElement.selectedIndex = index;
            option.selected = true;
          } else {
            option.selected = false;
          }
        });
        console.log(`Language select element value after setting: ${languageSelectElement.value}`);
        languageSelectElement.dispatchEvent(new Event('change')); // Dispatch change event
      }
    }
    if (userSettings.downloadLocation) {
      document.getElementById('download-location').value = userSettings.downloadLocation;
    }
    if (userSettings.askLocation !== undefined) {
      document.getElementById('ask-location').checked = userSettings.askLocation;
    }
    if (userSettings.backgroundUpdates !== undefined) {
      document.getElementById('background-updates').checked = userSettings.backgroundUpdates;
    }
  } catch (err) {
    console.error("Failed to load user settings:", err);
  }
}

async function saveSettings() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!currentUser.userId) {
    console.warn("No current user found. Cannot save settings.");
    return;
  }

  const settings = {
    theme: themeToggle.checked ? "light" : "dark",
    fontSize: document.getElementById('font-size').value,
    hardwareAcceleration: document.getElementById('hardware-acceleration')?.checked,
    memoryLimit: document.getElementById('memory-limit')?.value,
    defaultSearch: document.getElementById('default-search')?.value,
    languageSelect: document.getElementById('language-select')?.value,
    downloadLocation: document.getElementById('download-location')?.value,
    askLocation: document.getElementById('ask-location')?.checked,
    backgroundUpdates: document.getElementById('background-updates')?.checked
  };

  console.log("Attempting to save settings:", settings);

  try {
    const success = await saveUserSettings(currentUser.userId, settings);
    if (success) {
      console.log("Settings saved successfully!");
      // Notify main process that settings have been updated
      if (window.electronAPI && window.electronAPI.sendSettingsUpdate) {
        window.electronAPI.sendSettingsUpdate();
      }
    } else {
      console.warn("Settings save operation failed or not acknowledged by API.");
    }
  } catch (err) {
    console.error("Failed to save user settings:", err);
  }
}

// Save settings whenever certain inputs change
document.getElementById('font-size')?.addEventListener('change', () => {
  const fontSize = document.getElementById('font-size').value;
  document.body.style.fontSize = fontSize === "small" ? "0.8em" : fontSize === "large" ? "1.2em" : "1em";
  saveSettings();
});

document.getElementById('hardware-acceleration')?.addEventListener('change', saveSettings);
document.getElementById('memory-limit')?.addEventListener('change', saveSettings);
document.getElementById('default-search')?.addEventListener('change', saveSettings);
document.getElementById('language-select')?.addEventListener('change', saveSettings);
document.getElementById('download-location')?.addEventListener('change', saveSettings);
document.getElementById('ask-location')?.addEventListener('change', saveSettings);
document.getElementById('background-updates')?.addEventListener('change', saveSettings);

// --- Initialize page ---
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Sidebar button click handling
  document.querySelectorAll('.sidebar button[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sectionId = btn.getAttribute('data-section');
      showSection(sectionId, btn);
    });
  });

  // Event listener for the search bar
  document.querySelector('.search-bar').addEventListener('input', (event) => {
    filterMenu(event.target.value);
  });

  // Event listener for the "Reset to Defaults" button
  document.getElementById('reset-settings-button')?.addEventListener('click', resetSettings);

  // Event listener for the "Back" button
  document.getElementById('go-home-button')?.addEventListener('click', goHome);

  // Load user settings on page load
  loadSettings();
});
