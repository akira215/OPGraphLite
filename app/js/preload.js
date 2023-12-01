const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onAppQuit: (callback) => ipcRenderer.on('applicationAboutToQuit', callback),
  openList: () => ipcRenderer.invoke('dialog:openList')
  // we can also expose variables, not just functions
})