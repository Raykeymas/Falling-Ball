import AppGetColor from "../utils/color";

export type Position = {
    x: number,
    y: number,
}

export class Ball {

    position: Position;
    translate: number = 0;
    vx: number;
    vy: number;
    gy: number;
    width: number;
    height: number;
    color: string;
    context: CanvasRenderingContext2D | null | undefined;
    repulsion: number = 0.6;

    constructor(x: number, y: number, width: number, color: string, gy: number) {
        this.position = {
            x: x,
            y: y,
        }
        this.vx = 0;
        this.vy = 0;
        this.gy = gy;
        this.width = width;
        this.height = width;
        this.color = color;
        this.context = undefined;
    }

    setContext(context: CanvasRenderingContext2D) {
        if (this.context === undefined || this.context === null) {
            this.context = context;
        }
    }

    draw() {
        if (this.context) {
            this.context?.save();
            this.context?.translate(this.position.x + this.width - this.width/3 ,this.position.y + this.height/3);
            this.context?.rotate(this.translate * Math.PI / 180);
            this.context.fillStyle = this.color;
            this.context.fillRect(-this.width/2, -this.height/2,this.width, this.height);
            this.context.restore();
        }
    }

    fall() {
        if (this.context != null) {
            this.vy += this.gy;
            this.position.y = this.position.y + this.vy;
            if (this.context?.canvas.height < this.position.y + this.height) {
                this.vy *= -this.repulsion;
                this.position.y = this.context?.canvas.height - this.height; 
            }

            this.position.x = this.position.x + this.vx;
            if (this.position.x < 0) {
                this.vx *= this.repulsion;
                this.position.x = 0;
            } else if (this.position.x + this.width > this.context?.canvas.width) {
                this.vx *= -this.repulsion;
                this.position.x = this.context?.canvas.width - this.width;
            }
        }
    }

    rotate() {
        if (this.translate == 360) {
            this.translate = 0;
        } else {
            this.translate += 1;
        }
    }

    clicked() {
        this.repulsiveX();
        this.repulsiveY();
        this.changeColor();
    }

    isClicked(point: Position) {
        return ((this.position.x - this.width / 2) <= point.x && point.x <= this.position.x + this.width * 1.5) &&
        ((this.position.y - this.height / 2 ) <= point.y && point.y <= this.position.y + this.height*1.5);
    }

    changeColor() {
        const color = AppGetColor(this.color);
        this.color = color;
    }

    repulsiveX() {
        if (Math.random() > 0.5) {
            this.vx = this.repulsion*(1 + Math.floor(Math.random() * 15));
        } else {
            this.vx = -this.repulsion*(1 + Math.floor(Math.random() * 15));
        }
    }

    repulsiveY() {
        this.vy = -this.repulsion*30;
    }

}
