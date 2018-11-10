function Prompt(){}

/**************************************************************************************/

Prompt.prototype.setup = function(input_id, button_id, log_id, trace_box_id){
    this.input = d3.select('#'+input_id).data([this]);
    this.button = d3.select('#'+button_id).data([this]);
    this.log = d3.select('#'+log_id);
    this.trace_box = d3.select('#'+trace_box_id).data([this]);

    this.reset();
    this.createEvents();
}

/**************************************************************************************/

Prompt.prototype.reset = function(){
    this.sequence = [];
    this.log.selectAll('.log_item').remove();
}

/**************************************************************************************/

Prompt.prototype.undo = function(){
    this.sequence.pop();
    var log_items = this.log.selectAll('.log_item')._groups[0];
    var len = log_items.length;
    log_items[len-1].remove();
}

/**************************************************************************************/

Prompt.prototype.overlay_type_change = function(data){
    d3.select('#dimensions_select').select('.box_g').remove();
    var box_g = d3.select('#dimensions_select').append('span').attrs({ class: 'box_g' });
    if(data.value == 'none'){}
    if(data.value == 'square'){
        box_g.append('span').html('Chooose side length: ');
        box_g.append('input').attrs({ type: 'number', id: 'square_length', value: 5, step: 0.1 });
    }
    if(data.value == 'rect'){
        box_g.append('span').html('Chooose width: ');
        box_g.append('input').attrs({ type: 'number', id: 'rect_width', value: 10, step: 0.1 });
        box_g.append('br');
        box_g.append('span').attrs({ class: 'mt-2' }).html('Chooose height: ');
        box_g.append('input').attrs({ class: 'mt-2', type: 'number', id: 'rect_height', value: 5, step: 0.1 });
    }
    if(data.value == 'triangle'){
        box_g.append('span').html('Chooose side length: ');
        box_g.append('input').attrs({ type: 'number', id: 'triangle_length', value: 5, step: 0.1 });
    }
}

/**************************************************************************************/

Prompt.prototype.get_overlay_data = function(){
    this.simulation.overlay_type = d3.select('#shape_select').property('value');
}

/**************************************************************************************/

Prompt.prototype.event = function(data){
    this.sequence.push(data);
    var temp_tr = this.log.append('tr').attrs({ class: 'log_item' });
    temp_tr.append('th').html(this.sequence.length);
    temp_tr.append('td').html(() => {
        if(data.command == 'FD'){ return 'FORWARD' }
        if(data.command == 'BD'){ return 'BACKWARD' }
        if(data.command == 'RT'){ return 'RIGHT' }
        if(data.command == 'LT'){ return 'LEFT' }
    });
    temp_tr.append('td').html(data.value);
    temp_tr.append('td').html(() => {
        if(this.simulation.trace){ return 'TRACE ON' }
        return ''
    });
}

/**************************************************************************************/

Prompt.prototype.emitEvent = function(){
    var str = this.input.property('value');
    this.input.property('value', '');

    var command = str.split(' ')[0];
    var value = parseInt(str.split(' ')[1]);

    if( (command == 'FD' || command == 'fd') && isNaN(value) == false ){
        $('body').trigger('instruction', { command: 'FD', value: value });
    }

        if( (command == 'bd' || command == 'BD') && isNaN(value) == false ){
            $('body').trigger('instruction', { command: 'BD', value: value });
        }

    if( (command == 'rt' || command == 'RT') && isNaN(value) == false ){
        $('body').trigger('instruction', { command: 'RT', value: value });
    }

    if( (command == 'lt' || command == 'LT') && isNaN(value) == false ){
        $('body').trigger('instruction', { command: 'LT', value: value });
    }
}

/**************************************************************************************/

Prompt.prototype.createEvents = function(){
    this.input.on('keypress', function(d){
        if(d3.event.key == 'Enter'){ d.emitEvent(); }
    })

    this.button.on('click', function(d){
        d.emitEvent();
    })

    this.trace_box.on('change', function(d){
        d.simulation.trace = d3.select(this).property('checked');
    })

    d3.select('#shape_select').on('change', function(){
        $('body').trigger('overlay_type_change', { value: d3.select(this).property('value') })
    })
}