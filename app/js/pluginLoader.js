'use strict'

var availablePlugin = []; // List of JSON plugin object available on the hard disk

const pluginListElement = document.getElementById('pluginList')
const searchBar = document.getElementById('search-bar');

// Called by main to save before quit
window.electronAPI.onAppQuit((event) => {
    event.sender.send('readyToQuit');
});

// as soon as the DOM is loaded, load the available plugin via Main
document.addEventListener("DOMContentLoaded", (event) => {
	window.electronAPI.loadPluginList();
});


// Add the new plugin entry in the array and update the view, when Main discover a new one
window.electronAPI.onAppendPlugin((_event, pluginJson) => {

    
    pluginJson['id'] = availablePlugin.length; // numbering the plugin
    availablePlugin.push(pluginJson); // Push on the array of all available plugin

    // create the litegraph object via the createPluginNode that return a class object
    //It will be instanciated when during the ondrop event.
    LiteGraph.registerNodeType(pluginJson['name'], createPluginNode(pluginJson));
    //PluginNode.prototype.title = pluginJson['name'];
	createPluginEntry(pluginJson); // create the plugin on the sidebar
});

// Live filter the plugin list with the user entry
searchBar.addEventListener('input', (event) => {
    // live search functionality code
    let searchValue = event.target.value.trim().toLowerCase();
    const filteredPlugin = availablePlugin.filter( (plugin) => {
		// shall return true if we want to be display
		var result = plugin['name'].toLowerCase().includes(searchValue);
		if (plugin.hasOwnProperty('description')){
			result ||= plugin['description'].toLowerCase().includes(searchValue);
		}
		return result;
	});

    renderPlugin(filteredPlugin);
});

// Render the plugin list in the side bar, depending on the search results
const renderPlugin = (pluginList) => {
    pluginListElement.innerHTML = ""; // Clear existing list
    
    //console.log(pluginList);

    pluginList.forEach((plugin) => {
    	createPluginEntry(plugin);
    });
};


// Create the new DOM element for each plugin. Called during live search
const createPluginEntry = (plugin) => {
    // Create new element 'a'
    const newEntry = document.createElement('a');
    newEntry.href = "#"
    let classesToAdd = [ 'nav-link', 'text-white'];
    newEntry.classList.add(...classesToAdd);
    newEntry.setAttribute('plugin-index', plugin.id); // set an id to retrieve the entry in the list
    newEntry.setAttribute('data-bs-toggle', 'tooltip');
    newEntry.setAttribute('data-bs-placement', 'right');
    newEntry.setAttribute('data-bs-animation', 'true');
    newEntry.setAttribute('data-bs-title', plugin['description']);
    newEntry.setAttribute('draggable', 'true');
    newEntry.setAttribute('ondragstart', 'onDragStart(event)');
    newEntry.textContent = plugin['name'];

    // and new li entry
    const newLi = document.createElement('li');
    //newLi.classList.add('nav-item');
    newLi.appendChild(newEntry);

    pluginListElement.appendChild(newLi);

    // Initialize tooltips
    new bootstrap.Tooltip(newEntry);
};


// Drag and drop plugin in Canva view
function onDragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.getAttribute('plugin-index'));
    //ev.currentTarget.style.backgroundColor = 'yellow';
};

function onDragOver(ev) {
    ev.preventDefault();
};
