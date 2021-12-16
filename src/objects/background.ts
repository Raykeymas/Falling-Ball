import AppGetColor from "../utils/color";
import { Ball, Position } from "./ball";

export class BackGround extends Ball {

    isSpread: Boolean = false;
    previousColor: string = "white";
    tmpWidth: number = 0;
    tmpHeight: number = 0;

    constructor() {
        super(0,0,0,"",0);
        this.vx = 30;
        this.vy = 30;
    }
    
    draw() {
        if (this.context) {
            this.context.save();
            this.context.fillStyle = this.previousColor;
            this.context.fillRect(0,0, this.context.canvas.width, this.context.canvas.height);
            this.context.translate(this.position.x + this.tmpWidth / 2 ,this.position.y + this.tmpHeight / 2);
            this.context.rotate(this.translate * Math.PI / 180);
            this.context.fillStyle = this.color;
            this.context.fillRect(-this.width/2, -this.height/2,this.width, this.height);
            this.context.restore();
        }
    }

    start(position: Position, width: number, height: number, color: string, translate: number) {
        this.position = {
            x: position.x,
            y: position.y,
        };
        this.width = width;
        this.tmpWidth = width;
        this.height = height;
        this.tmpHeight = height;
        this.translate = translate;
        this.isSpread = true;
        if (this.color.length != 0) {
            this.previousColor = this.color;
        }
        this.color = AppGetColor(color);
    }

    spread() {
        if (this.context) {
            if (this.isSpread) {
                this.width += this.vx;
                this.height += this.vy;
            }
    
            if (this.width > this.context?.canvas.width * 10) {
                this.isSpread = false;
            }    
        }
    }

}