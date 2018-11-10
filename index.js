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
}