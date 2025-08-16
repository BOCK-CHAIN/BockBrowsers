// --- Top Bar & Navigation Functions ---

// Go back in current tab
function goBack() {
  const webview = document.getElementById(currentTabId);
  if (webview && typeof webview.canGoBack === 'function' && webview.canGoBack()) {
    webview.goBack();
  }
}

// Go forward in current tab
function goForward() {
  const webview = document.getElementById(currentTabId);
  if (webview && typeof webview.canGoForward === 'function' && webview.canGoForward()) {
    webview.goForward();
  }
}

// Go home (default URL)
function goHome() {
  const webview = document.getElementById(currentTabId);
  if (webview) {
    webview.src = 'https://duckduckgo.com';
  }
}

// Load URL from input field
function loadURL() {
  const urlInput = document.getElementById('url');
  let url = urlInput.value.trim();

  if (!url) {
    alert('Please enter a URL.');
    return;
  }
  try {
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    const urlObj = new URL(url);
    url = urlObj.href;
  } catch (e) {
    alert('Invalid URL entered.');
    return;
  }

  const webview = document.getElementById(currentTabId);
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
