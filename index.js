$(document).ready(function(){
    setup();
})

/**************************************************************************************/

var simulation;

/**************************************************************************************/

function setup(){
    simulation = new Simulation();
    simulation.setup();

    createEventListeners();
}

/**************************************************************************************/

function reset(){
    simulation.reset();
}

/**************************************************************************************/

function undo(){
    simulation.undo();
}

/**************************************************************************************/

function createEventListeners(){
    $('body').on('instruction', function(event, data){
        simulation.event(data);
    })

    $('body').on('overlay_type_change', function(event, data){
        simulation.overlay_type_change(data);
    })

    d3.select('#create_overlay_button').on('click', function(){
        simulation.create_overlay();
    })

    d3.select('#hide_button').on('click', function(){
        d3.select('#shape_controls').styles({ display: 'none' });
    })

    d3.select('#scale_select').on('change', function(){
        var scale = d3.select(this).property('value');
        if(scale == 'A'){ simulation.visual.scale_turtle = 3; }
        if(scale == 'B'){ simulation.visual.scale_turtle = 30; }
    })
}