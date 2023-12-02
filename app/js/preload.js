const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onAppQuit: (callback) => ipcRenderer.on('applicationAboutToQuit', callback),
  openList: () => ipcRenderer.send('openList'), // triger by rendered to start exploration
  onAppendPlugin: (callback) => ipcRenderer.on('appendPlugin', callback) // triggerred by Main each time a new plugin is discovered
  //openList: () => ipcRenderer.invoke('dialog:openList')
  // we can also expose variables, not just functions
})