// main/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startServer } = require('./server'); // Import server function



let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false, // Needed to allow ipcRenderer access
      nodeIntegration: true    // Needed to use require in renderer
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../public/renderer.html'));

  mainWindow.webContents.openDevTools();

  // Start server 
  startServer();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});