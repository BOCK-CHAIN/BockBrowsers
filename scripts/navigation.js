// scripts/navigation.js

document.addEventListener("DOMContentLoaded", () => {
  // Navigation helpers exposed globally

  window.goHome = function () {
    const activeView = document.querySelector("webview.active");
    if (activeView) {
      const searchEngines = {
        google: 'https://www.google.com',
        bing: 'https://www.bing.com',
        duckduckgo: 'https://duckduckgo.com',
        yahoo: 'https://www.yahoo.com',
      };
      const homeUrl = searchEngines[window.defaultSearchEngine] || searchEngines.google;
      activeView.loadURL(homeUrl);
    }
  };

  window.openSettings = function () {
    // Option 1: Load settings in a new tab
    if (window.createNewTab) {
      window.createNewTab(`pages/settings.html`);
    }

    // Option 2: Open settings in current tab (overwrite)
    // const view = document.querySelector("webview.active");
    // if (view) view.loadURL(`pages/settings.html`);
  };

  window.navigateTo = function (url) {
    const view = document.querySelector("webview.active");
    if (!view) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      const searchEngines = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q=',
        yahoo: 'https://search.yahoo.com/search?p=',
      };
      const searchUrl = searchEngines[window.defaultSearchEngine] || searchEngines.google;
      url = `${searchUrl}${encodeURIComponent(url)}`;
    }
    view.loadURL(url);
  };
});
