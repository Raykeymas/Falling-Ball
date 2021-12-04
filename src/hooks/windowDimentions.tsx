import { useEffect, useState } from "react";

export const useWindowDimentions = () => {
    const getWindowDimentions = () => {
        const { innerWidth: width, innerHeight: height} = window;
        return { width, height};
    }

    const [windowDimentions, setWindowDimentions] = useState(getWindowDimentions());

    useEffect(() => {
        
        const onResize = () => {
            setWindowDimentions(getWindowDimentions());
        }

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    return windowDimentions;
}