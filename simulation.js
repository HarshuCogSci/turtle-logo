function Simulation(){}

/**************************************************************************************/

Simulation.prototype.setup = function(){
    this.trace = true;

    this.visual = new Visual();
    this.visual.setup('turtle_space');
    this.visual.simulation = this;

    this.prompt = new Prompt();
    this.prompt.setup('command_input', 'command_enter', 'command_log', 'trace_box');
    this.prompt.simulation = this;
}

/**************************************************************************************/

Simulation.prototype.reset = function(){
    this.visual.reset();
    this.prompt.reset();
}

/**************************************************************************************/

Simulation.prototype.undo = function(){
    this.visual.undo();
    this.prompt.undo();
}

/**************************************************************************************/

Simulation.prototype.erase_history = function(){
    this.visual.erase_history();
    this.prompt.erase_history();
}

/**************************************************************************************/

Simulation.prototype.event = function(data){
    this.visual.event(data);
    this.prompt.event(data);
}

/**************************************************************************************/

Simulation.prototype.overlay_type_change = function(data){
    this.prompt.overlay_type_change(data);
}

/**************************************************************************************/

Simulation.prototype.create_overlay = function(){
    this.prompt.get_overlay_data();
    this.visual.create_overlay();
}