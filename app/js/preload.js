const { contextBridge, ipcRenderer } = require('electron')
const koffi = require('koffi'); // for dynamic lib load

contextBridge.exposeInMainWorld('electronAPI', {
  onAppQuit: (callback) => ipcRenderer.on('applicationAboutToQuit', callback),
  loadPluginList: () => ipcRenderer.send('loadPluginList'), // trigger by rendered to start exploration
  onAppendPlugin: (callback) => ipcRenderer.on('appendPlugin', callback), // triggerred by Main each time a new plugin is discovered
  onSave: (callback) => ipcRenderer.on('onSave', (_event) => callback()), // while saving the entire graph
  configObj: (value) => ipcRenderer.send('onConfigObj', value),
  onLoad: (callback) => ipcRenderer.on('onLoad', (_event,data) => callback(data)), //while loading an entire graph
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('loadLib', {
  loadLib (p) {
    return koffi.load(p);
  }
});