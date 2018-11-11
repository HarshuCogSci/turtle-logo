function Visual(){}

/**************************************************************************************/

Visual.prototype.setup = function(svg_id, canvas_id){
    this.svg = d3.select('#'+svg_id);
    this.width = parseFloat( this.svg.style('width') );
    this.height = parseFloat( this.svg.style('height') );
    this.svg.attrs({ width: this.width, height: this.height });

    this.origin = this.svg.append('g').attrs({ transform: 'translate(' +0.1*this.width+ ',' +0.9*this.height+ ')' });

    this.overlay = this.origin.append('path').styles({ stroke: 'gray', fill: 'none' });

    this.turtle_g = this.origin.append('g');
    this.turtle = this.turtle_g.append('path').attrs({ id: 'turtle', d: 'M 0 -40 L 12 0 L -12 0 z' });

    this.scale_turtle = 30;
    this.scale_overlay = 30;
    this.overlay_id = null;

    this.reset();
}

/**************************************************************************************/

Visual.prototype.reset = function(){
    this.sequence = [];
    this.origin_x = 0;
    this.origin_y = 0;
    this.origin_x_old = 0;
    this.origin_y_old = 0;
    this.origin_angle = 0;

    this.origin.selectAll('.trace').remove();
    this.render_turtle();
}

/**************************************************************************************/

Visual.prototype.undo = function(){
    var temp_event = this.sequence.pop();
    this.calculate();
    if(temp_event == undefined){ return }
    if(temp_event.type == 'translate'){ this.eraseLine(); }
}

/**************************************************************************************/

Visual.prototype.erase_history = function(){
    // this.sequence = [];
    this.origin.selectAll('.trace').remove();

    // this.turtle_g = this.origin.append('g');
}


/**************************************************************************************/

Visual.prototype.create_overlay = function(){
    var type = this.simulation.overlay_type;
    if(type == 'none'){ this.overlay.attrs({ d: '' }) };
    if(type == 'square'){
        var length = parseFloat( d3.select('#square_length').property('value') );
        if(length == undefined){ length = 0; }
        length = parseInt(length*10)/10;
        d3.select('#square_length').property('value', length);
        length *= this.scale_overlay;

        this.overlay.attrs({ d: 'M 0 0 L ' +length+ ' 0 L ' +length+ ' ' +(-length)+ ' L 0 ' +(-length)+ ' z' });
    };

    if(type == 'rect'){
        var width = parseFloat( d3.select('#rect_width').property('value') );
        if(width == undefined){ width = 0; }
        width = parseInt(width*10)/10;
        d3.select('#rect_width').property('value', width);
        width *= this.scale_overlay;

        var height = parseFloat( d3.select('#rect_height').property('value') );
        if(height == undefined){ width = 0; }
        height = parseInt(height*10)/10;
        d3.select('#rect_height').property('value', height);
        height *= this.scale_overlay;

        this.overlay.attrs({ d: 'M 0 0 L ' +width+ ' 0 L ' +width+ ' ' +(-height)+ ' L 0 ' +(-height)+ ' z' });
    };

    if(type == 'triangle'){
        var length = parseFloat( d3.select('#triangle_length').property('value') );
        if(length == undefined){ length = 0; }
        length = parseInt(length*10)/10;
        d3.select('#triangle_length').property('value', length);
        length *= this.scale_overlay;

        this.overlay.attrs({ d: 'M 0 0 L ' +length+ ' 0 L ' +0.5*length+ ' ' +(-0.5*Math.sqrt(3)*length)+ ' z' });
    };
}

/**************************************************************************************/

Visual.prototype.event = function(data){
    if(data.command == 'FD'){ this.translate(data.value); }
    if(data.command == 'BD'){ this.translate(-data.value); }
    if(data.command == 'RT'){ this.rotate(data.value); }
    if(data.command == 'LT'){ this.rotate(-data.value); }
}

Visual.prototype.rotate = function(angle){
    this.sequence.push({ type: 'rotation', value: angle });
    this.calculate();
    // if(this.simulation.trace){ this.appendLine(); }
}

Visual.prototype.translate = function(dist){
    this.sequence.push({ type: 'translate', value: dist*this.scale_turtle });
    this.calculate();
    if(this.simulation.trace){ this.appendLine(); }
}

/**************************************************************************************/

Visual.prototype.calculate = function(){
    this.origin_x_old = this.origin_x;
    this.origin_y_old = this.origin_y;
    this.origin_x = 0;
    this.origin_y = 0;
    this.origin_angle = 0;

    var temp_length = this.sequence.length;
    for(var i=0; i<temp_length; i++){
        var d = this.sequence[i];
        if(d.type == 'rotation'){ this.origin_angle += d.value; }
        if(d.type == 'translate'){
            this.origin_x += d.value*Math.sin(this.origin_angle*Math.PI/180);
            this.origin_y -= d.value*Math.cos(this.origin_angle*Math.PI/180);
        }
    }

    // if(this.simulation.trace){ this.appendLine(); }
    this.render_turtle();
}

/**************************************************************************************/

Visual.prototype.appendLine = function(){
    var event = this.sequence[this.sequence.length-1];
    if(event == undefined){ return }

    var temp_line = this.origin.append('line')
        .attrs({ x1: this.origin_x_old, y1: this.origin_y_old, x2: this.origin_x_old, y2: this.origin_y_old, class: 'trace' })
        .styles({ stroke: 'black', 'stroke-width': 3 })
        .transition()
        .duration(10*event.value)
        .ease(d3.easeLinear)
        .attrs({ x2: this.origin_x, y2: this.origin_y });
}

/**************************************************************************************/

Visual.prototype.eraseLine = function(){
    var lines = this.origin.selectAll('line')._groups[0];
    var len = lines.length;
    lines[len-1].remove();
}

/**************************************************************************************/

Visual.prototype.render_turtle = function(){
    var event = this.sequence[this.sequence.length-1];

    if(event == undefined){
        this.turtle_g
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attrs({ transform: 'translate(' +this.origin_x+ ',' +this.origin_y+ ') rotate(' +this.origin_angle+ ')' });
        return
    }

    if(event.type == 'translate'){
        this.turtle_g
            .transition()
            .duration(10*Math.abs(event.value))
            .ease(d3.easeLinear)
            .attrs({ transform: 'translate(' +this.origin_x+ ',' +this.origin_y+ ') rotate(' +this.origin_angle+ ')' });
    }

    if(event.type == 'rotation'){
        this.turtle_g
            .transition()
            .duration(8*Math.abs(event.value))
            .ease(d3.easeLinear)
            .attrs({ transform: 'translate(' +this.origin_x+ ',' +this.origin_y+ ') rotate(' +this.origin_angle+ ')' });
    }
}