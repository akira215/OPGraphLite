'use strict'

var availablePlugin = []; // List of JSON plugin object available on the hard disk


const pluginListElement = document.getElementById('pluginList')
const searchBar = document.getElementById('search-bar');


window.electronAPI.onAppQuit((event) => {
    event.sender.send('readyToQuit');
});

// as soon as the DOM is loaded, load the available plugin
document.addEventListener("DOMContentLoaded", (event) => {
	window.electronAPI.openList();
	console.log('trigger the plugin exploration')
});


// Add the new plugin entry in the array and update the view
window.electronAPI.onAppendPlugin((_event, pluginJson) => {

    // Push on the array of all available plugin
    availablePlugin.push(pluginJson);
	createPluginEntry(pluginJson);
});

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

const renderPlugin = (pluginList) => {
    pluginListElement.innerHTML = ""; // Clear existing list

    pluginList.forEach((plugin) => {
    	createPluginEntry(plugin);
    });
};

const createPluginEntry = (plugin) => {
    // Create new element 'a'
    const newEntry = document.createElement('a');
    newEntry.href = "#"
    let classesToAdd = [ 'nav-link', 'text-white'];
    newEntry.classList.add(...classesToAdd);
    newEntry.setAttribute('data-bs-toggle', 'tooltip');
    newEntry.setAttribute('data-bs-placement', 'right');
    newEntry.setAttribute('data-bs-animation', 'true');
    newEntry.setAttribute('data-bs-title', plugin['description']);
    newEntry.textContent = plugin['name'];

    // and new li entry
    const newLi = document.createElement('li');
    //newLi.classList.add('nav-item');
    newLi.appendChild(newEntry);

    pluginListElement.appendChild(newLi);

    // Initialize tooltips
    new bootstrap.Tooltip(newEntry);
};