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

    //createPluginNode(pluginJson); // create the litegraph object
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

// Custom Node creation. The created class will be instancied only when creating the node (during drop event)
function createPluginNode(plugin){
    class basePlugin {
        constructor(){
            //this.plugin = plugin;
            if (plugin.hasOwnProperty('name')){
                this.title = plugin['name'];
            } else {
                this.title = 'no name'
            }
            
            this.color = '#353535';
            if (plugin.hasOwnProperty('color')){
                this.color = plugin['color'];
            }

            if (plugin.hasOwnProperty('inputs')){
                plugin['inputs'].forEach((input) => {
                    this.addInput(input['name'],input['type']);
                });
            }
            if (plugin.hasOwnProperty('outputs')){
                plugin['outputs'].forEach((output) => {
                    this.addOutput(output['name'],output['type']);
                });
            }

            if (plugin.hasOwnProperty('properties')){
                plugin['properties'].forEach((prop) => {
                    this.addProperty = (prop['name'], prop['default']);

                    // add widget to node
                    var value = prop['default'];
                    var options = { property: prop['name']};
                    if (prop.hasOwnProperty('min')){
                        options['min'] = prop['min'];
                    }
                    if (prop.hasOwnProperty('max')){
                        options['max'] = prop['max'];
                    }
                    if (prop.hasOwnProperty('precision')){
                        options['precision'] = prop['precision'];
                        options['step'] = Math.pow(10,-prop['precision']) * 10;//Litegraph mutliply by 0.1 the step
                    }
                    if (prop.hasOwnProperty('step')){
                        options['step'] = prop['step'] * 10; //Litegraph mutliply by 0.1 the step

                    }
                    // type of control
                    var widget = "";
                    if (prop.hasOwnProperty('type')){
                        switch (prop['type']) {
                            case 'number':
                            case 'float':
                            case 'double':
                                widget = "number";
                                break;
                            case 'integer':
                                widget = "number";
                                options['precision'] = 0;
                                options['step']  = 10;
                                value = Math.trunc(value);
                                break;
                            case 'string':
                            case 'text':
                                widget = "text";
                                break;
                            case 'bool':
                            case 'boolean':
                                widget = "toggle";
                                break;
                            default:
                                console.error('Type ' + prop['type'] +' is not correct in ' + plugin.name);
                        }
                              
                    }
                    if (prop.hasOwnProperty('widget')){
                        widget = prop['widget'];
                    }
                    this.addWidget(widget,prop['name'], value, options); //this will modify the node.properties
                });
            }
            //console.log("Created" + plugin.name);
        }
        
        // color the node. onDrawForeground to be called in case of live view
        onDrawBackground = function(ctx, graphcanvas){
        if(this.flags.collapsed)
            return;

            //Background color
            ctx.fillStyle = this.color;
            ctx.roundRect(0, 0, this.size[0],this.size[1], 8);
            ctx.fill();

            // Separator
            ctx.shadowColor = "transparent";
			ctx.fillStyle = "rgba(0,0,0,0.2)";
			ctx.fillRect(0, -1, this.size[0], 2);

        }

        onExecute(){
        }
    }
    return basePlugin;
}
