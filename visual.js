function Visual(){}

/**************************************************************************************/

Visual.prototype.setup = function(svg_id, canvas_id){
    this.svg = d3.select('#'+svg_id);
    this.width = parseFloat( this.svg.style('width') );
    this.height = parseFloat( this.svg.style('height') );
    this.svg.attrs({ width: this.width, height: this.height });

    this.origin = this.svg.append('g').attrs({ transform: 'translate(' +0.5*this.width+ ',' +0.5*this.height+ ')' });
    this.turtle_g = this.origin.append('g');
    this.turtle = this.turtle_g.append('path').attrs({ id: 'turtle', d: 'M 0 -40 L 12 0 L -12 0 z' });

    this.scale = 20;

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

Visual.prototype.event = function(data){
    if(data.command == 'FD'){ this.translate(data.value); }
    if(data.command == 'BD'){ this.translate(-data.value); }
    if(data.command == 'RT'){ this.rotate(data.value); }
    if(data.command == 'LT'){ this.rotate(-data.value); }
}

Visual.prototype.rotate = function(angle){
    this.sequence.push({ type: 'rotation', value: angle });
    this.calculate();
}

Visual.prototype.translate = function(dist){
    this.sequence.push({ type: 'translate', value: dist*this.scale });
    this.calculate();
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

    if(this.simulation.trace){ this.appendLine(); }
    this.render_turtle();
}

/**************************************************************************************/

Visual.prototype.appendLine = function(){
    var temp_line = this.origin.append('line')
        .attrs({ x1: this.origin_x_old, y1: this.origin_y_old, x2: this.origin_x_old, y2: this.origin_y_old, class: 'trace' })
        .styles({ stroke: 'black' })
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attrs({ x2: this.origin_x, y2: this.origin_y });
}

/**************************************************************************************/

Visual.prototype.render_turtle = function(){
    this.turtle_g
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attrs({ transform: 'translate(' +this.origin_x+ ',' +this.origin_y+ ') rotate(' +this.origin_angle+ ')' });
}