// --- Main Browser Logic ---

window.addEventListener('DOMContentLoaded', () => {
  // Load Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // URL bar: press Enter to load
  document.getElementById('url').addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadURL();
    }
  });

  // Menu actions
  window.newTab = () => {
    createNewTab();
    document.getElementById('dropdown').classList.remove('show');
  };

  window.newIncognito = () => {
    createIncognitoTab();
    document.getElementById('dropdown').classList.remove('show');
  };

  window.newWindow = () => {
    if (window.electronAPI && window.electronAPI.openNewWindow) {
      window.electronAPI.openNewWindow();
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

  // Create the first default tab
  createNewTab();
});
