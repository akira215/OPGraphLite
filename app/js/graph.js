'use strict'

const ipc = require('electron').ipcRenderer;

// TODO send readyToQuit after saving
ipc.on('applicationAboutToQuit', (evt) => ipc.send('readyToQuit'));