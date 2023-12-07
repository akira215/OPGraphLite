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
    
	//console.log(plugin);
	//Create the new node and attach it
	var newNode = LiteGraph.createNode(plugin['name']);
	newNode.pos = [ev.offsetX, ev.offsetY];
	
    graph.add(newNode);

    ev.dataTransfer.clearData(); // re initialize the data transfer obj
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