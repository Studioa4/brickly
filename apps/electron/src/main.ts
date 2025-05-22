const electron = require('electron');
const path = require('path');
const fs = require('fs');

const { app, BrowserWindow, ipcMain, dialog } = electron;

app.disableHardwareAcceleration(); // ✅ Disabilita accelerazione hardware

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('stampa-pdf', async (_: Electron.IpcMainInvokeEvent, fileUrl: string) => {
    const win = new BrowserWindow({ show: false });
    await win.loadURL(fileUrl);
    win.webContents.print({ silent: false });
  });

  iipcMain.handle('salva-pdf', async (_: Electron.IpcMainInvokeEvent, fileUrl: string) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: 'visura.pdf'
    });
    if (!canceled && filePath) {
      const response = await fetch(fileUrl);
      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});