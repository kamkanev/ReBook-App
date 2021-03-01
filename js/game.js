var brush = new Brush();

var points = [];

function update() {
    brush.update(mouseX, mouseY);
    brush.draw(points);
    brush.type = getType();
    brush.form = getForm();
}

function draw() {
    // This is how you draw a rectangle
    for (var j = 0; j < points.length; j++) {

        for(var i = 1; i < points[j].length; i++){
            if(points[j][i].type == 0){
                context.strokeStyle = points[j][i].c;
            context.beginPath();
            context.moveTo(points[j][i-1].x, points[j][i-1].y);
            context.lineTo(points[j][i].x, points[j][i].y);
            context.lineWidth = points[j][i].s;
            context.stroke();
            // context.fill();
            context.closePath();
            }else if(points[j][i].type == 1){
                context.fillStyle = points[j][i].c;
                switch (points[j][i].form) {
                    case 0:
                        context.fillRect(points[j][i].x - points[j][i].s/2, points[j][i].y - points[j][i].s/2, points[j][i].s, points[j][i].s);
                        break;
                    case 1:

                        context.beginPath();

                    context.moveTo(points[j][i].x, points[j][i].y - points[j][i].s);
                    context.lineTo(points[j][i].x + points[j][i].s, points[j][i].y + points[j][i].s);
                    context.lineTo(points[j][i].x - points[j][i].s, points[j][i].y + points[j][i].s);


                    context.fill();
                    context.closePath();

                        break;
                    case 2:
                      context.beginPath();

                      context.arc(points[j][i].x, points[j][i].y, points[j][i].s, 0, 2*Math.PI);


                      context.fill();
                      context.closePath();
                      break;
                    default:
                        context.fillRect(points[j][i].x - points[j][i].s/2, points[j][i].y - points[j][i].s/2, points[j][i].s, points[j][i].s);
                        break;
                }
            }
        }

    }
    brush.makeVisible();
};

function keyup(key) {
    // Show the pressed keycode in the console
    console.log("Pressed", key);
};

function mouseup() {
    // Show coordinates of mouse on click
    console.log("Mouse clicked at", mouseX, mouseY);
    brush.isPressed = false;
};

function mousedown() {
    // Show coordinates of mouse on click
    console.log("Mouse clicked at", mouseX, mouseY);
    brush.isPressed = true;
    points.push(new Array());
};
