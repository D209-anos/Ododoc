// src/hooks/useCarouselControl.ts
import { useState, useRef } from 'react';

interface UseCarouselControlProps {
    itemCount: number; // Carousel의 아이템 수
}

interface CarouselControl {
    angle: number;
    translateZ: number;
    handleMouseDown: (event: MouseEvent) => void;
    handleMouseUp: (event: MouseEvent) => void;
    handlePrevClick: () => void;
    handleNextClick: () => void;
}

export function useCarouselControl({ itemCount }: UseCarouselControlProps): CarouselControl {
    const [angle, setAngle] = useState(0);
    const [translateZ, setTranslateZ] = useState(0);
    const ratateAngle = 360 / itemCount;
    const dragStartX = useRef(0);

    const handleMouseDown = (event: MouseEvent) => {
        dragStartX.current = event.clientX;
    };

    const handleMouseUp = (event: MouseEvent) => {
        const dragEndX = event.clientX;
        const dragDistance = dragEndX - dragStartX.current;
        if (Math.abs(dragDistance) > 100) {
            setAngle(prevAngle => prevAngle + (dragDistance > 0 ? -ratateAngle : ratateAngle));
        }
    };

    const handlePrevClick = () => {
        setAngle(prevAngle => prevAngle - ratateAngle);
    };

    const handleNextClick = () => {
        setAngle(prevAngle => prevAngle + ratateAngle);
    };

    // Z축 변환 계산
    const radian = (ratateAngle / 2) * Math.PI / 180;
    const newTranslateZ = Math.round((800 / 2) / Math.tan(radian));
    setTranslateZ(newTranslateZ);

    return { angle, translateZ, handleMouseDown, handleMouseUp, handlePrevClick, handleNextClick };
}
