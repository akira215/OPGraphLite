'use strict'

const canvasEl =  document.getElementById('graph');
const parent = document.getElementById('graphContainer');



var graph = new LGraph();

var canvas = new LGraphCanvas("#graph", graph);

var node_const = LiteGraph.createNode("basic/const");
node_const.pos = [200,200];
graph.add(node_const);
node_const.setValue(4.5);

var node_watch = LiteGraph.createNode("basic/watch");
node_watch.pos = [700,200];
graph.add(node_watch);

node_const.connect(0, node_watch, 0 );

graph.start()

// as soon as the DOM is loaded, resize the canvas to fill space
document.addEventListener("DOMContentLoaded", (event) => {
    canvas.resize();
});

window.onresize = function() {
    canvas.resize();
}

// Drag an drop a new node in the canva
function onDrop(ev) {
    const ind = ev.dataTransfer.getData('text');
    const plugin = availablePlugin[ind]; // the plugin that has been dragged

    loadPlugin(plugin);

	//Create the new node and attach it
	var newNode = LiteGraph.createNode(plugin['name']);
	newNode.pos = [ev.offsetX, ev.offsetY];
	
    graph.add(newNode);

    ev.dataTransfer.clearData(); // re initialize the data transfer obj
};

// Load the plugin and load the function in the plugin object
function loadPlugin(plugin) {
    // This call will load the lib if required and return 
    // the index of the function to be called in the function pointer array
    // Find functions
    if (!plugin.process) {

            // check the input type
            let inputsType =[];
            if (plugin.hasOwnProperty('inputs'))
                plugin['inputs'].forEach((input) => {
                    if (input.hasOwnProperty('type'))
                        inputsType.push(input['type']);
                    else{
                        console.error('error loading' + plugin['name'] + ': \'type\' property not found in input');
                        console.error(inputs);
                    }
                });

            //output type
            //TODO change the implementation according to OP_plugin implementation
            let outputsType = null;
            if (plugin.hasOwnProperty('outputs'))
                outputsType = plugin['outputs'][0].type
            else
                outputsType = 'void';

            console.log(inputsType);

            //TODO check if there are output, input, path, filename,...
            // load the .dll o .so file
            const lib = window.loadLib.loadLib(plugin.path + plugin.filename);

            // find the function
            let func = lib.stdcall(plugin.function, outputsType, inputsType);
            plugin.process = func;
            console.log(plugin.process(6,7));
    } else {
        console.log('already loaded');
    }

};



window.electronAPI.onLoad((data) => {
    
    if(data)
        graph.configure( data );

    // TODO add a check is a plugin is not installed to deal with notifications
});

// on save, trigger the saving of the graph
window.electronAPI.onSave(() => {
    var data = JSON.stringify( graph.serialize(), null, "\t" );
    window.electronAPI.configObj(data);
});