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
}