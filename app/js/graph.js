'use strict'

//const ipc = require('electron').ipcRenderer;

// TODO send readyToQuit after saving
//ipc.on('applicationAboutToQuit', (evt) => ipc.send('readyToQuit'));


const information = document.getElementById('info')


information.innerText = `This app is using Chrome (v${electronAPI.chrome()}), Node.js (v${electronAPI.node()}), and Electron (v${electronAPI.electron()})`

window.electronAPI.onAppQuit((event) => {
    event.sender.send('readyToQuit');
})