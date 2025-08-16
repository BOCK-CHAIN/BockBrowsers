const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  navigateTo: (target) => ipcRenderer.invoke('navigate-to', target),
  openNewWindow: () => ipcRenderer.invoke('open-new-window')
});
