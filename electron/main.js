const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let mainWindow;

function createWindow(initialPage = 'login.html', isIncognito = false) {
  console.log(`[main.js] createWindow called: initialPage=${initialPage}, isIncognito=${isIncognito}`);
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // allow <webview>
      sandbox: false // Disable sandboxing for full Node.js access in preload
    }
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'pages', initialPage));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle navigation requests from renderer
ipcMain.handle('navigate-to', (event, target) => {
  const webContents = event.sender;
  const browserWindow = BrowserWindow.fromWebContents(webContents);

  if (target === 'home') {
    browserWindow.loadFile(path.join(__dirname, '..', 'pages', 'index.html'));
  } else if (target === 'settings') {
    browserWindow.loadFile(path.join(__dirname, '..', 'pages', 'settings.html'));
  } else if (target === 'login') {
    browserWindow.loadFile(path.join(__dirname, '..', 'pages', 'login.html'));
  } else if (target === 'users') {
    browserWindow.loadFile(path.join(__dirname, '..', 'pages', 'users.html'));
  }
});


// Optional: open a new browser window
ipcMain.handle('open-new-window', (event, isIncognito) => {
  console.log(`[main.js] open-new-window IPC called: isIncognito=${isIncognito}`);
  const newWin = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Allow <webview> in new windows
      sandbox: false, // Disable sandboxing for full Node.js access in preload
    }
  });
  if (isIncognito) {
    const incognitoHtmlPath = path.join(__dirname, '..', 'pages', 'incognito.html');
    newWin.loadFile(incognitoHtmlPath);
  } else {
    const indexHtmlPath = path.join(__dirname, '..', 'pages', 'index.html');
    newWin.loadFile(indexHtmlPath);
  }
});

ipcMain.on('settings-updated', (event) => {
  // Broadcast to all windows, or specific windows if needed
  BrowserWindow.getAllWindows().forEach(win => {
    if (win !== event.sender.getOwnerBrowserWindow()) { // Don't send back to the sender
      win.webContents.send('main-process-settings-updated');
    }
  });
});

app.on('ready', () => createWindow('login.html'));
// Start with login.html
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
