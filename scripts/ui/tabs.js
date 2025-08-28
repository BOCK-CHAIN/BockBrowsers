// --- Tab Management System ---
let tabCount = 0;
let tabs = [];
let currentTabId = null;

const webviewsContainer = document.getElementById('webviews');
const tabBar = document.getElementById('tabs-container') || document.getElementById('tab-bar');

// Create a standard browsing tab
function createNewTab(url = '') {
  if (!url) {
    const searchEngines = {
      google: 'https://www.google.com',
      bing: 'https://www.bing.com',
      duckduckgo: 'https://duckduckgo.com',
      yahoo: 'https://www.yahoo.com',
    };
    url = searchEngines[window.defaultSearchEngine] || searchEngines.google; // Fallback to Google
  }
  tabCount++;
  const tabId = `tab-${tabCount}`;
  console.log(`[tabs.js] createNewTab called. Tab ID: ${tabId}, URL: ${url}`);

  const tabButton = document.createElement('button');
  tabButton.textContent = `Tab ${tabCount}`;
  tabButton.classList.add('tab-button');
  tabButton.onclick = () => switchToTab(tabId);
  tabBar.appendChild(tabButton);

  const tabWebview = document.createElement('webview');
  tabWebview.id = tabId;
  tabWebview.setAttribute('webpreferences', 'contextIsolation=true, webviewTag=true');
  tabWebview.src = url;
  webviewsContainer.appendChild(tabWebview);

  console.log(`[TabManager] Creating new tab with ID: ${tabId}, URL: ${url}`);

  attachWebviewEvents(tabId, tabWebview, false);

  tabs.push({ id: tabId, webview: tabWebview, button: tabButton, incognito: false });
  switchToTab(tabId);
}

// Create an incognito tab
function createIncognitoTab(url = '') {
  if (!url) {
    const searchEngines = {
      google: 'https://www.google.com',
      bing: 'https://www.bing.com',
      duckduckgo: 'https://duckduckgo.com',
      yahoo: 'https://www.yahoo.com',
    };
    url = searchEngines[window.defaultSearchEngine] || searchEngines.google; // Fallback to Google
  }
  tabCount++;
  const tabId = `tab-incognito-${tabCount}`;
  console.log(`[tabs.js] createIncognitoTab called. Tab ID: ${tabId}, URL: ${url}`);

  const tabButton = document.createElement('button');
  tabButton.textContent = `Incognito ${tabCount}`;
  tabButton.classList.add('tab-button', 'incognito');
  tabButton.onclick = () => switchToTab(tabId);
  tabBar.appendChild(tabButton);

  const tabWebview = document.createElement('webview');
  tabWebview.id = tabId;
  tabWebview.setAttribute('webpreferences', 'contextIsolation=true, webviewTag=true');
  tabWebview.partition = `persist:incognito-${tabCount}`;
  tabWebview.classList.add('incognito');
  tabWebview.src = url;
  webviewsContainer.appendChild(tabWebview);

  console.log(`[TabManager] Creating new incognito tab with ID: ${tabId}, URL: ${url}`);

  attachWebviewEvents(tabId, tabWebview, true);

  tabs.push({ id: tabId, webview: tabWebview, button: tabButton, incognito: true });
  switchToTab(tabId);
}

// Attach events to webview
function attachWebviewEvents(tabId, webview, incognito) {
  console.log(`[tabs.js] Attaching events for tab ID: ${tabId}, Incognito: ${incognito}`);
  const updateURLInput = e => {
    if (tabId === currentTabId) {
      const urlInput = document.getElementById('url');
      if (urlInput) urlInput.value = e.url;
    }
  };

  webview.addEventListener('did-navigate', updateURLInput);
  webview.addEventListener('did-navigate-in-page', updateURLInput);

  webview.addEventListener('did-fail-load', event => {
    console.error('[Webview Error] Load failed:', event.errorCode, event.errorDescription, event.validatedURL);
    if (tabId === currentTabId) {
      alert('Page failed to load.');
    }
  });

  // Ensure URL bar updates after DOM is ready
  webview.addEventListener('dom-ready', () => {
    console.log(`[Webview] DOM Ready for tab ID: ${tabId}, URL: ${webview.getURL()}`);
    if (tabId === currentTabId) {
      const urlInput = document.getElementById('url');
      if (urlInput) {
        const currentURL = webview.getURL();
        urlInput.value = currentURL;
        console.log(`[TabManager] URL bar updated for tab ID: ${tabId} to ${currentURL}`);
        if (incognito) urlInput.classList.add('incognito');
        else urlInput.classList.remove('incognito');
      }
    }
  });
}

// Switch active tab
function switchToTab(tabId) {
  console.log(`[tabs.js] Switching to tab: ${tabId}`);
  if (tabId === currentTabId) return;

  tabs.forEach(({ id, webview, button, incognito }) => {
    if (id === tabId) {
      currentTabId = id;
      button.classList.add('active');
      webview.classList.add('active');

      const urlInput = document.getElementById('url');
      if (urlInput) {
        // Update URL safely
        if (webview.isDomReady) {
          try {
            urlInput.value = webview.getURL();
            console.log(`[TabManager] URL bar updated for tab ID: ${tabId} to ${webview.getURL()}`);
          } catch {
            urlInput.value = webview.src;
            console.log(`[TabManager] URL bar updated (src) for tab ID: ${tabId} to ${webview.src}`);
          }
        } else {
          webview.addEventListener('dom-ready', () => {
            try {
              urlInput.value = webview.getURL();
              console.log(`[TabManager] URL bar updated (dom-ready) for tab ID: ${tabId} to ${webview.getURL()}`);
            } catch {
              urlInput.value = webview.src;
              console.log(`[TabManager] URL bar updated (dom-ready, src) for tab ID: ${tabId} to ${webview.src}`);
            }
          }, { once: true });
        }

        if (incognito) urlInput.classList.add('incognito');
        else urlInput.classList.remove('incognito');
      }
    } else {
      button.classList.remove('active');
      webview.classList.remove('active');
    }
  });
}

// Expose globally for use in other scripts
window.createNewTab = createNewTab;
window.createIncognitoTab = createIncognitoTab;
window.switchToTab = switchToTab;
