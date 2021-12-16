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

    isSmall: Boolean;
    smallBalls: Ball[];

    constructor(x: number, y: number, width: number, color: string, gy: number, isSmall: Boolean = false) {
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
        this.smallBalls = [];
        this.isSmall = isSmall;
    }

    setContext(context: CanvasRenderingContext2D) {
        if (this.context === undefined || this.context === null) {
            this.context = context;
        }
    }

    draw() {
        if (this.context) {
            if (this.smallBalls.length != 0) {
                this.smallBalls.forEach((ball) => {
                    ball.fall();
                    ball.rotate();
                    ball.draw();
                })
            } else {
                this.context?.save();
                this.context?.translate(this.position.x + this.width - this.width / 3, this.position.y + this.height / 3);
                this.context?.rotate(this.translate * Math.PI / 180);
                this.context.fillStyle = this.color;
                this.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                this.context.restore();
            }
        }
    }

    fall() {
        if (this.context != null) {
            this.vy += this.gy;
            this.position.y = this.position.y + this.vy;
            if (this.context?.canvas.height < this.position.y) {
                // this.vy *= -this.repulsion;
                // this.position.y = this.context?.canvas.height - this.height; 
                if (this.smallBalls.length == 0 && !this.isSmall) {
                    this.explosion();
                }
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

    explosion() {
        for (var i = 0; i < 200; i++) {
            var ball = new Ball(this.position.x, this.position.y, this.width / 10, AppGetColor(this.color), 0.4, true);
            if (this.context != null) {
                ball.setContext(this.context);
                ball.clicked();
            }
            this.smallBalls.push(ball);
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
            ((this.position.y - this.height / 2) <= point.y && point.y <= this.position.y + this.height * 1.5);
    }

    changeColor() {
        const color = AppGetColor(this.color);
        this.color = color;
    }

    repulsiveX() {
        if (Math.random() > 0.5) {
            this.vx = this.repulsion * (1 + Math.floor(Math.random() * 20));
        } else {
            this.vx = -this.repulsion * (1 + Math.floor(Math.random() * 20));
        }
    }

    repulsiveY() {
        this.vy = -this.repulsion * (15 + Math.floor(Math.random() * 20));
    }

}
