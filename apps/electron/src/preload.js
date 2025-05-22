const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  stampa: (fileUrl) => ipcRenderer.invoke('stampa-pdf', fileUrl),
  salva: (fileUrl) => ipcRenderer.invoke('salva-pdf', fileUrl)
});