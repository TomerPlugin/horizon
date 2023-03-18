const { app, BrowserWindow } = require('electron');
const path = require('path');


let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
      width: 900,
      height: 600,
      minWidth: 400,
      minHeight:500,
      webPreferences: {
          nodeIntegration: true,
          preload: path.join(__dirname, '/preload.js'),
      },
      frame: false,
      // transparent: true,
      show: false,

  });

  // mainWindow.loadFile(path.join(__dirname, '/index.html'));
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.once('ready-to-show', mainWindow.show);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});