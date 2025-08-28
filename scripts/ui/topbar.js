// --- Top Bar & Navigation Functions ---

// Go back in current tab
function goBack() {
  const webview = document.getElementById(window.currentTabId) || document.getElementById('incognito-webview');
  if (webview && typeof webview.canGoBack === 'function' && webview.canGoBack()) {
    webview.goBack();
  }
}

// Go forward in current tab
function goForward() {
  const webview = document.getElementById(window.currentTabId) || document.getElementById('incognito-webview');
  if (webview && typeof webview.canGoForward === 'function' && webview.canGoForward()) {
    webview.goForward();
  }
}

// Go home (default URL)
function goHome() {
  const webview = document.getElementById(window.currentTabId) || document.getElementById('incognito-webview');
  if (webview) {
    const searchEngines = {
      google: 'https://www.google.com',
      bing: 'https://www.bing.com',
      duckduckgo: 'https://duckduckgo.com',
      yahoo: 'https://www.yahoo.com',
    };
    webview.src = searchEngines[window.defaultSearchEngine] || searchEngines.google; // Fallback to Google
  }
}

// Load URL from input field
function loadURL() {
  const urlInput = document.getElementById('url');
  let url = urlInput.value.trim();

  if (!url) {
    alert('Please enter a URL or search query.');
    return;
  }

  // Check if it's a valid URL
  let isValidUrl = false;
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    url = urlObj.href;
    isValidUrl = true;
  } catch (e) {
    // Not a valid URL, treat as a search query
    isValidUrl = false;
  }

  if (!isValidUrl) {
    const query = encodeURIComponent(url);
    const searchEngines = {
      google: `https://www.google.com/search?q=${query}`,
      bing: `https://www.bing.com/search?q=${query}`,
      duckduckgo: `https://duckduckgo.com/?q=${query}`,
      yahoo: `https://search.yahoo.com/search?q=${query}`,
    };
    url = searchEngines[window.defaultSearchEngine] || searchEngines.google; // Fallback to Google
  }

  const webview = document.getElementById(window.currentTabId) || document.getElementById('incognito-webview');
  if (webview) {
    console.log('Loading URL:', url);
    webview.src = url;
  } else {
    console.warn('No active webview to load URL');
  }
}

// Open/close dropdown menu
function toggleDropdown() {
  document.getElementById('dropdown').classList.toggle('show');
}

// Close dropdown if clicking outside
window.onclick = function (e) {
  if (!e.target.closest('.menu-container')) {
    document.getElementById('dropdown').classList.remove('show');
  }
};

// Expose functions globally for use in HTML
window.goBack = goBack;
window.goForward = goForward;
window.goHome = goHome;
window.loadURL = loadURL;
window.toggleDropdown = toggleDropdown;
