// --- Tab Management System ---
let tabCount = 0;
let tabs = [];
let currentTabId = null;

const webviewsContainer = document.getElementById('webviews');
const tabBar = document.getElementById('tab-bar');

// Create a standard browsing tab
function createNewTab(url = 'https://duckduckgo.com') {
  tabCount++;
  const tabId = `tab-${tabCount}`;

  const tabButton = document.createElement('button');
  tabButton.textContent = `Tab ${tabCount}`;
  tabButton.classList.add('tab-button');
  tabButton.onclick = () => switchToTab(tabId);
  tabBar.appendChild(tabButton);

  const tabWebview = document.createElement('webview');
  tabWebview.id = tabId;
  tabWebview.setAttribute('webpreferences', 'contextIsolation');
  tabWebview.src = url;
  webviewsContainer.appendChild(tabWebview);

  // Update URL input when navigation happens
  const updateURLInput = e => {
    if (tabId === currentTabId) {
      const urlInput = document.getElementById('url');
      if (urlInput) urlInput.value = e.url;
    }
  };
  tabWebview.addEventListener('did-navigate', updateURLInput);
  tabWebview.addEventListener('did-navigate-in-page', updateURLInput);

  tabWebview.addEventListener('did-fail-load', event => {
    console.error('Load failed:', event.errorCode, event.errorDescription, event.validatedURL);
    if (tabId === currentTabId) {
      alert('Page failed to load.');
    }
  });

  tabs.push({ id: tabId, webview: tabWebview, button: tabButton, incognito: false });

  switchToTab(tabId);
}

// Create an incognito tab
function createIncognitoTab(url = 'https://duckduckgo.com') {
  tabCount++;
  const tabId = `tab-incognito-${tabCount}`;

  const tabButton = document.createElement('button');
  tabButton.textContent = `Incognito ${tabCount}`;
  tabButton.classList.add('tab-button', 'incognito');
  tabButton.onclick = () => switchToTab(tabId);
  tabBar.appendChild(tabButton);

  const tabWebview = document.createElement('webview');
  tabWebview.id = tabId;
  tabWebview.setAttribute('webpreferences', 'contextIsolation');
  tabWebview.partition = `persist:incognito-${tabCount}`;
  tabWebview.classList.add('incognito');
  tabWebview.src = url;
  webviewsContainer.appendChild(tabWebview);

  const updateURLInput = e => {
    if (tabId === currentTabId) {
      const urlInput = document.getElementById('url');
      if (urlInput) urlInput.value = e.url;
    }
  };
  tabWebview.addEventListener('did-navigate', updateURLInput);
  tabWebview.addEventListener('did-navigate-in-page', updateURLInput);

  tabWebview.addEventListener('did-fail-load', event => {
    console.error('Load failed:', event.errorCode, event.errorDescription, event.validatedURL);
    if (tabId === currentTabId) {
      alert('Page failed to load.');
    }
  });

  tabs.push({ id: tabId, webview: tabWebview, button: tabButton, incognito: true });

  switchToTab(tabId);
}

// Switch active tab
function switchToTab(tabId) {
  if (tabId === currentTabId) return;

  tabs.forEach(({ id, webview, button, incognito }) => {
    if (id === tabId) {
      currentTabId = id;
      button.classList.add('active');
      webview.classList.add('active');

      const urlInput = document.getElementById('url');
      if (urlInput) {
        urlInput.value = webview.getURL ? webview.getURL() : webview.src;
        if (incognito) {
          urlInput.classList.add('incognito');
        } else {
          urlInput.classList.remove('incognito');
        }
      }
    } else {
      button.classList.remove('active');
      webview.classList.remove('active');
    }
  });
}
