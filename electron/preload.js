const { contextBridge, ipcRenderer } = require('electron');
const axios = require('axios');

const API_BASE = "http://localhost:3000";

contextBridge.exposeInMainWorld('electronAPI', {
  navigateTo: (target) => ipcRenderer.invoke('navigate-to', target),
  openNewWindow: (isIncognito) => ipcRenderer.invoke('open-new-window', isIncognito),
  sendSettingsUpdate: () => ipcRenderer.send('settings-updated'), // New function to notify main process
  onSettingsUpdate: (callback) => ipcRenderer.on('main-process-settings-updated', callback),

  // Neon API for users
  getUsers: async () => {
    const res = await axios.get(`${API_BASE}/users`);
    return res.data;
  },
  addUser: async (name, email) => {
    const res = await axios.post(`${API_BASE}/users`, { name, email });
    return res.data;
  }
});
