const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  onAppQuit: (callback) => ipcRenderer.on('applicationAboutToQuit', callback)
  // we can also expose variables, not just functions
})