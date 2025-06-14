const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  navigateTo: (page) => ipcRenderer.send('navigate', page),
  openNewTab: () => ipcRenderer.send('open-new-tab'),
  openNewWindow: () => ipcRenderer.send('open-new-window'),
  openIncognito: () => ipcRenderer.send('open-incognito')
});
