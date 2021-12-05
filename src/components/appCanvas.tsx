import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useWindowDimentions } from "../hooks/windowDimentions";
import { BackGround } from "../objects/background";
import { Ball } from "../objects/ball";

const CanvasBox = styled.div`
    height: 100%;
    width: 100%;
`;

const AppCanvas = () => {

    const ball = new Ball(0,0,100,"black", 0.4);
    const background = new BackGround();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const {width, height} = useWindowDimentions();

    const loop = () => {
        context?.clearRect(0,0, context.canvas.width, context.canvas.height);
        background.draw();
        ball.draw();
        background.spread();
        ball.fall();
        ball.rotate();
        window.requestAnimationFrame(loop);
    }

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = width;
            canvasRef.current.height = height;
            const renderCtx = canvasRef.current.getContext("2d");
            if (renderCtx) {
                setContext(renderCtx);
            }
        }
        if (context) {
            // Windowがリサイズした時毎回処理が走るのを止める
            ball.setContext(context);
            background.setContext(context);
            canvasRef.current?.addEventListener("click", (event) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                    const clickPoint = {
                        x: event.clientX - rect?.left,
                        y: event.clientY - rect?.top,
                    };
                    if (ball.isClicked(clickPoint)) {
                        ball.clicked();
                        background.start(ball.position, ball.width, ball.height, ball.color, ball.translate);
                    }
                }
            });
            loop();
        }
    }, [context,width,height]);

    return (<CanvasBox>
        <canvas ref={canvasRef} ></canvas>
    </CanvasBox>);
}

export default AppCanvas;