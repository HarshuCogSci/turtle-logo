$(document).ready(function(){
    setup();
})

var simulation;

function setup(){
    simulation = new Simulation();
    simulation.setup();

    // visual = new Visual();
    // visual.setup('turtle_space', 'stroke_space');

    // prompt = new Prompt();
    // prompt.setup('command_input', 'command_enter', 'command_log');

    // createEventListeners();
}

function reset(){
    // visual.reset();
    // prompt.reset();
}

function createEventListeners(){
    $('body').on('instruction', function(event, data){
        if(data.command == 'fd' || data.command == 'FD'){
            visual.translate(data.value);
            prompt.append(data);
        }

        if(data.command == 'rt' || data.command == 'RT'){
            visual.rotate(data.value);
            prompt.append(data);
        }

        if(data.command == 'lt' || data.command == 'LT'){
            visual.rotate(-data.value);
            prompt.append(data);
        }
    })
}