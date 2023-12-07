'use strict'

const os = require('os')
const path = require('path')
const { app, BrowserWindow, ipcMain, globalShortcut, Menu, Notification} = require('electron')


const pluginFolder = '../plugins/';
const pluginFile = 'op_plugin.json';

const config = require(path.join(__dirname, 'package.json'))

app.setName(config.productName)
var mainWindow = null


const templateMenu = [
	// { role: 'fileMenu' }
	{
		label: 'File',
		submenu: [
			{ role: 'quit' }
		]
	},
	// { role: 'editMenu' }
	{
	  	label: 'Edit',
		submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'delete' },
			{ type: 'separator' },
			{ label: 'Editor Preferences', 
				icon: path.join(__dirname, 'app','img', 'person-gear.png'),
				click: () => {
					// Open the childWindow ThemeEditor.html
					const childWindow = new BrowserWindow({
						width: 1024,
						height: 768,
						backgroundColor: 'lightgray',
						title: config.productName + ' Theme Editor',
    					icon: path.join(__dirname, 'app','img', 'OPicon.png'),
						parent:  mainWindow,
						// modal: true,
						webPreferences: {
							nodeIntegration: true,
							contextIsolation: false,
							enableRemoteModule: true,
						},
					});
					childWindow.removeMenu();
					childWindow.loadFile(path.join(__dirname,'app','html','themeEditor.html'))
					childWindow.show();
					childWindow.webContents.openDevTools()
				}
			},
			{ label: 'Test vue', 
				icon: path.join(__dirname, 'app','img', 'person-gear.png'),
				click: () => {
					// Open the childWindow ThemeEditor.html
					const childWindow = new BrowserWindow({
						width: 1024,
						height: 768,
						backgroundColor: 'lightgray',
						title: config.productName + ' Test',
    					icon: path.join(__dirname, 'app','img', 'OPicon.png'),
						parent:  mainWindow,
						// modal: true,
						webPreferences: {
							nodeIntegration: true,
							contextIsolation: false,
							enableRemoteModule: true,
						},
					});
					childWindow.removeMenu();
					childWindow.loadFile(path.join(__dirname,'app','vue','index.html'))
					childWindow.show();
					childWindow.webContents.openDevTools()
				}
			}
		]
	},
	// { role: 'viewMenu' }
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forceReload' },
			{ role: 'toggleDevTools' },
			{ type: 'separator' },
			{ role: 'resetZoom' },
			{ role: 'zoomIn' },
			{ role: 'zoomOut' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' }
		]
	},
	// { role: 'windowMenu' }
	{
		label: 'Window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'zoom' },
		]
	},
	{
		role: 'help',
		submenu: [
			{
			label: 'Learn More',
			click: async () => {
				const { shell } = require('electron')
				await shell.openExternal('https://electronjs.org')
			}
			}
		]
	}
]
  
const menu = Menu.buildFromTemplate(templateMenu)
Menu.setApplicationMenu(menu)


const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
	//frame: false, // frameless window
    backgroundColor: 'lightgray',
		title: config.productName,
    icon: path.join(__dirname, 'app','img', 'OPicon.png'),
    webPreferences: {
			preload: path.join(__dirname, 'app','js','preload.js'),
			//nodeIntegration: true,
			//contextIsolation: true,
			//enableRemoteModule: true,
		},
    show: false,
  })

  mainWindow.loadFile(path.join(__dirname,'app','html','index.html'))


  // Enable keyboard shortcuts for Developer Tools on various platforms.
	let platform = os.platform()
	if (platform === 'darwin') {
		globalShortcut.register('Command+Option+I', () => {
			mainWindow.webContents.openDevTools()
		})
	} else if (platform === 'linux' || platform === 'win32') {
		globalShortcut.register('Control+Shift+I', () => {
			mainWindow.webContents.openDevTools()
		})
		globalShortcut.register('f5', ()=> {
			console.log('f5 is pressed')
			mainWindow.reload()
		})
	}
}

function showNotification (msg, title) {
	const notification = {
		title: title,
		body: msg,
		icon: path.join(__dirname, 'app','img', '68013_pin_orange_location_icon.png'),
		urgency:'low' //'critical','normal'
	}
	new Notification(notification).show()
}


app.whenReady().then(() => {

	var readyToQuit = false;
	createWindow()

	//////////////////////////////////////////////TODEL
	mainWindow.webContents.openDevTools()
	//////////////////////////////////////////////TODEL
	mainWindow.once('ready-to-show', () => {
		//mainWindow.setMenu(null)
		mainWindow.maximize();
	
		mainWindow.show() 
		
	});

  mainWindow.onbeforeunload = (e) => {
		// Prevent Command-R from unloading the window contents.
		e.returnValue = false
	}

	mainWindow.on('close', function (e) {
		if(!readyToQuit){
			e.preventDefault();
			mainWindow.webContents.send('applicationAboutToQuit');
		}
	});

	
  

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
		}
	})

	mainWindow.on('closed', function () {
			mainWindow = null
	});

	// Listening to renderer event that inform that all saving stuff has been performed
	ipcMain.on('readyToQuit',  (_event) => {
		readyToQuit = true;
		mainWindow.close();
	});

	//ipcMain.handle('dialog:openList', generatePluginList)

	ipcMain.on('loadPluginList', generatePluginList)

	ipcMain.on('notImplemented', (e)=>showNotification ('Not yet implemented bro', 'Hey, guy')); //TODO

});


// Generate the plugin list and send a signal to renderer each a time a new one is discover
async function generatePluginList () {
	
	const fs = require('fs');
	
	fs.readdir(pluginFolder, (err, files) => {
		try {
			files.forEach(file => {
				if (fs.statSync(pluginFolder + '/' + file).isDirectory()) {
					// Try to read 
					if (fs.existsSync(pluginFolder + '/' + file + '/' + pluginFile)) {
						let jsonData = require(pluginFolder + "/" + file + "/" + pluginFile);
						if (isValidPlugin(jsonData)){
							mainWindow.webContents.send('appendPlugin', jsonData);
						} else {
							console.error(pluginFolder + "/" + file + "/" + pluginFile + " is invalid" )
						}
					} else {
						console.error(pluginFolder + "/" + file + "/" + pluginFile + " doesn't exist" )
					}
				}
			  });
		} catch(err) {
			console.error(err)
		}
	});
}

//return true if the JSON object contain the minimum require value
function isValidPlugin(pluginJSON) {
	let result = true;
	result &&= pluginJSON.hasOwnProperty('name');
	//result &&= pluginJSON.hasOwnProperty('inputs');
	//result &&= pluginJSON.hasOwnProperty('outputs');
	return result;
}



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});