function Prompt(){}

Prompt.prototype.setup = function(input_id, button_id, log_id){
    this.input = d3.select('#'+input_id).data([this]);
    this.button = d3.select('#'+button_id).data([this]);
    this.log = d3.select('#'+log_id);

    this.reset();
    this.createEvents();
}

Prompt.prototype.reset = function(){
    this.sequence = [];
    this.log.selectAll('.log_item').remove();
}

Prompt.prototype.append = function(data){
    this.sequence.push(data);
    this.log.append('div').attrs({ class: 'log_item' }).html(this.sequence.length + '. ' + data.command + ' ' + data.value);
}

/******************************************************************************************************/

Prompt.prototype.emitEvent = function(){
    var str = this.input.property('value');
    this.input.property('value', '');

    var command = str.split(' ')[0];
    var value = parseInt(str.split(' ')[1]);

    if( (command == 'FD' || command == 'fd') && isNaN(value) == false ){
        $('body').trigger('instruction', { command: 'FD', value: value });
    }

    if( (command == 'rt' || command == 'RT') && isNaN(value) == false ){
        $('body').trigger('instruction', { command: 'RT', value: value });
    }

    if( (command == 'lt' || command == 'LT') && isNaN(value) == false ){
        $('body').trigger('instruction', { command: 'LT', value: value });
    }
}

Prompt.prototype.createEvents = function(){
    this.input.on('keypress', function(d){
        if(d3.event.key == 'Enter'){ d.emitEvent(); }
    })

    this.button.on('click', function(d){
        d.emitEvent();
    })
}