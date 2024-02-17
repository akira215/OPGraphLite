// Custom Node creation. The created class will be instancied only when creating the node (during drop event)
// Create and return the class object of the plugin. the argument is an object containing the description of the node
function createPluginNode(plugin){
    class basePlugin {
        constructor(){
            //this.plugin = plugin;
            if (plugin.hasOwnProperty('name')){
                this.title = plugin['name'];
            } else {
                this.title = 'no name'
            }
            
            this.color = '#353535'; // Defaut color
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

            if (plugin.hasOwnProperty('process')){
                this.process =  plugin['process'];
            }

            if (plugin.hasOwnProperty('properties')){
                plugin['properties'].forEach((prop) => {
                    this.addProperty = (prop['name'], prop['value']);

                    // add widget to node
                    var value = prop['value'];
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
                    //TODO add combo type
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

            let args = [];

            console.log(this.title);
            
            if (this.inputs) {
                this.inputs.forEach((input,i)=>{
                    let val = this.getInputData(i) || 0; // TODO add default value ? || 0
                    args.push(val); 

                });
            }
                
            //console.log(...args);

            //console.log(this.process(...args));
            this.setOutputData(0,this.process(...args));

            
        }
    }
    return basePlugin;
}