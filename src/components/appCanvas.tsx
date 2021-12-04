import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useWindowDimentions } from "../hooks/windowDimentions";
import { Ball } from "../objects/ball";

const CanvasBox = styled.div`
    height: 100%;
    width: 100%;
`;

const AppCanvas = () => {

    const ball = new Ball(0,0,100,"black", 0.4);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const {width, height} = useWindowDimentions();

    const loop = () => {
        ball.draw();
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
            canvasRef.current?.addEventListener("click", (event) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (rect) {
                    const clickPoint = {
                        x: event.clientX - rect?.left,
                        y: event.clientY - rect?.top,
                    };
                    if (ball.isClicked(clickPoint)) {
                        ball.clicked();
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