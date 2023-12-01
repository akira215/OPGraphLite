'use strict'

//const ipc = require('electron').ipcRenderer;

// TODO send readyToQuit after saving
//ipc.on('applicationAboutToQuit', (evt) => ipc.send('readyToQuit'));


const btn = document.getElementById('btn')
const pluginListElement = document.getElementById('pluginList')

window.electronAPI.onAppQuit((event) => {
    event.sender.send('readyToQuit');
})

btn.addEventListener('click', async () => {
    const pluginList = await window.electronAPI.openList();
    //pluginListElement.innerText = filePath
    var i=0;
    let statement = new Array(3);
    for(i=0;i<pluginList.length;i++)
    {
        statement[i]="<li class=\"nav-item\"><a href=\"#\" id=\"plugin-id" + i + 
            "\" class=\"nav-link text-white\">"+pluginList[i]+
                "</a></li>";
        console.log(statement[i]);
        pluginListElement.innerHTML+=statement[i];
    }

  })