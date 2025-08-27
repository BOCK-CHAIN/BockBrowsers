// --- Main Browser Logic ---

window.addEventListener('DOMContentLoaded', () => {
  // Load Lucide icons

  // URL bar: press Enter to load
  const urlInput = document.getElementById('url');
  if (urlInput) {
    urlInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        loadURL();
      }
    });
  }

  // Menu actions
  window.newTab = () => {
    if (window.createNewTab) {
      window.createNewTab();
    }
    document.getElementById('dropdown').classList.remove('show');
  };

  window.newIncognito = () => {
    if (window.electronAPI && window.electronAPI.openNewWindow) {
      window.electronAPI.openNewWindow(true); // Pass true for incognito
      document.getElementById('dropdown').classList.remove('show');
    } else {
      alert('New incognito window function is not available.');
    }
  };

  window.newWindow = () => {
    if (window.electronAPI && window.electronAPI.openNewWindow) {
      window.electronAPI.openNewWindow(false); // Pass false for a regular new window
      document.getElementById('dropdown').classList.remove('show');
    } else {
      alert('New window function is not available.');
    }
  };

  window.openSettings = () => {
    if (window.electronAPI && window.electronAPI.navigateTo) {
      window.electronAPI.navigateTo('settings');
      document.getElementById('dropdown').classList.remove('show');
    } else {
      alert('Settings function is not available.');
    }
  };
});
