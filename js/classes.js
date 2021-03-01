class Brush{
    constructor(x = 0, y = 0, size = 1, color = "#000", type = 0){
        this.x = x;
        this.y = y;
        this.s = size;
        this.c = color;
        this.type = type;
        this.isPressed = false;
        this.form = 0;
    }
    updateLocation(newX, newY){
        this.x = this.x+(newX-this.x);
        this.y = this.y+(newY-this.y);
    }
    update(newX, newY){
        this.updateLocation(newX, newY);
        this.c = getColor();
        this.s = getSize();
        if(this.type == 0){
            if(this.s >= 3){
                this.s = 3;
                document.getElementById('sizeP').value = "3";
            }
        }
    }
    makeVisible(){
        if(this.type == 0){
            context.beginPath();
        context.fillStyle = this.c;
        context.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        }else if(this.type == 1){
            context.fillStyle = this.c;
            switch (this.form) {
                case 0:
                    context.fillRect(this.x - this.s/2, this.y - this.s/2, this.s, this.s);
                    break;
                case 1:
                    context.beginPath();

                    context.moveTo(this.x, this.y - this.s);
                    context.lineTo(this.x + this.s, this.y + this.s);
                    context.lineTo(this.x - this.s, this.y + this.s);


                    context.fill();
                    context.closePath();
                    break;
                case 2:
                context.beginPath();

                context.arc(this.x, this.y, this.s, 0, 2*Math.PI);


                context.fill();
                context.closePath();
                  break;
                default:
                    context.fillRect(this.x - this.s/2, this.y - this.s/2, this.s, this.s);
                    break;
            }
        }else if(this.type == 2){
          
        }
    }
    draw(points){
        if(this.isPressed){
            points[points.length-1].push({type: this.type, form: this.form, x: this.x, y: this.y, c: this.c, s: this.s});
        }
    }
}
