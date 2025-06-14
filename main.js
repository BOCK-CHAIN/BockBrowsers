const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

function createMainWindow(incognito = false) {
  const webPrefs = {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false,
    contextIsolation: true,
    webviewTag: true,
    sandbox: true // enable Chromium sandboxing
  };


  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: incognito
      ? { ...webPrefs, session: session.fromPartition(`persist:incognito-${Date.now()}`) }
      : webPrefs
  });
  
  win.setMenuBarVisibility(false); // hides the menu bar

  win.loadFile('index.html');
  return win;
}

let mainWindow;

app.whenReady().then(() => {
  mainWindow = createMainWindow();

  ipcMain.on('open-new-tab', () => {
    createMainWindow(); // acts like a new tab
  });

  ipcMain.on('open-new-window', () => {
    createMainWindow(); // same as above for now
  });

  ipcMain.on('open-incognito', () => {
    createMainWindow(true); // pass true to enable incognito
  });

  ipcMain.on('navigate', (event, page) => {
    if (page === 'settings') mainWindow.loadFile('settings.html');
    if (page === 'home') mainWindow.loadFile('index.html');
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow = createMainWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
