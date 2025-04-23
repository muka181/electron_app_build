const { app, BrowserWindow } = require('electron');
const path = require('path');

// Optional: allow reusing this template without issues on Linux
// app.commandLine.appendSwitch('no-sandbox'); // Not needed when using CLI flag

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true, // Recommended for security
      nodeIntegration: false, // Also recommended
      // preload: path.join(__dirname, 'preload.js') // optional if needed
    }
  });

  win.loadFile(path.join(__dirname, '../public/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS re-create a window if none are open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Quit the app on non-macOS platforms
  if (process.platform !== 'darwin') app.quit();
});
