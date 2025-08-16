// scripts/navigation.js

document.addEventListener("DOMContentLoaded", () => {
  // Navigation helpers exposed globally

  window.goHome = function () {
    const activeView = document.querySelector("webview.active");
    if (activeView) {
      activeView.loadURL("https://www.google.com"); // or your homepage
    }
  };

  window.openSettings = function () {
    // Option 1: Load settings in a new tab
    if (window.createTab) {
      window.createTab(`pages/settings.html`);
    }

    // Option 2: Open settings in current tab (overwrite)
    // const view = document.querySelector("webview.active");
    // if (view) view.loadURL(`pages/settings.html`);
  };

  window.navigateTo = function (url) {
    const view = document.querySelector("webview.active");
    if (!view) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    }
    view.loadURL(url);
  };
});
