const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow(initialPage = 'login.html') {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true // allow <webview>
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'pages', initialPage));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle navigation requests from renderer
ipcMain.handle('navigate-to', (event, target) => {
  if (target === 'home') {
    mainWindow.loadFile(path.join(__dirname, '..', 'pages', 'index.html'));
  } else if (target === 'settings') {
    mainWindow.loadFile(path.join(__dirname, '..', 'pages', 'settings.html'));
  } else if (target === 'login') {
    mainWindow.loadFile(path.join(__dirname, '..', 'pages', 'login.html'));
  }
});

// Optional: open a new browser window
ipcMain.handle('open-new-window', () => {
  const newWin = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  newWin.loadFile(path.join(__dirname, '..', 'pages', 'index.html'));
});

app.on('ready', () => createWindow('login.html'));
// Start with login.html
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
