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
