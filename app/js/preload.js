const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onAppQuit: (callback) => ipcRenderer.on('applicationAboutToQuit', callback),
  loadPluginList: () => ipcRenderer.send('loadPluginList'), // trigger by rendered to start exploration
  onAppendPlugin: (callback) => ipcRenderer.on('appendPlugin', callback), // triggerred by Main each time a new plugin is discovered
  onSave: (callback) => ipcRenderer.on('onSave', (_event) => callback()),
  configObj: (value) => ipcRenderer.send('onConfigObj', value),
  onLoad: (callback) => ipcRenderer.on('onLoad', (_event,data) => callback(data)),
  //openList: () => ipcRenderer.invoke('dialog:openList')
  // we can also expose variables, not just functions
})