function Visual(){}

/**************************************************************************************/

Visual.prototype.setup = function(svg_id, canvas_id){
    this.svg = d3.select('#'+svg_id);
    // this.canvas = d3.select('#'+canvas_id);

    this.width = parseFloat( this.svg.style('width') );
    this.height = parseFloat( this.svg.style('height') );

    // this.canvas.attrs({ width: this.width, height: this.height });
    // this.ctx = this.canvas.node().getContext("2d");
    // this.ctx.translate(0.5*this.width, 0.5*this.height);

    this.origin_svg = this.svg.append('g').attrs({ transform: 'translate(' +0.5*this.width+ ',' +0.5*this.height+ ')' });
    this.turtle_g = this.origin_svg.append('g');
    this.turtle = this.turtle_g.append('path').attrs({ id: 'turtle', d: 'M 0 -10 L 6 10 L -6 10 z' });

    this.reset();
}

Visual.prototype.reset = function(){
    this.sequence = [];
    this.origin_x = 0;
    this.origin_y = 0;
    this.origin_x_old = 0;
    this.origin_y_old = 0;
    this.origin_angle = 0;

    // this.ctx.fillStyle = '#FFF';
    // this.ctx.fillRect(-0.5*this.width, -0.5*this.height, this.width, this.height);

    // this.fillStyle = '#000';
    // this.ctx.lineWidth = 2;

    this.render();
}

Visual.prototype.rotate = function(angle){
    this.sequence.push({ type: 'rotation', value: angle });
    this.calculate();
}

Visual.prototype.translate = function(dist){
    this.sequence.push({ type: 'translate', value: dist });
    this.calculate();
}

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

    this.render();
}

Visual.prototype.render = function(){
    this.turtle_g.attrs({ transform: 'translate(' +this.origin_x+ ',' +this.origin_y+ ') rotate(' +this.origin_angle+ ')' });

    // this.ctx.beginPath();
    // this.ctx.moveTo(this.origin_x_old, this.origin_y_old);
    // this.ctx.lineTo(this.origin_x, this.origin_y);
    // this.ctx.stroke();
}