import React from 'react';
import Home5 from '../../../css/components/homePage/Home5.module.css';

interface CarouselElement {
    src: string;
    label: string;
    content: string;
    button: string;
    path: string;
}

interface CarouselItemProps {
    element: CarouselElement;
    itemAngle: number;
    translateZ: number;
    isMain: boolean;
    handleNavigate: (path: string) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ element, itemAngle, translateZ, isMain, handleNavigate }) => {
    return (
        <div
            className={Home5.carouselElement}
            style={{
                transform: `rotateY(${itemAngle}deg) translateZ(${translateZ}px)`,
                opacity: isMain ? 1 : 0.2
            }}
            >
            <img
                src={element.src}
                alt={`${element.label}-icon`}
                style={{ width: '100%', height: 'auto' }}
            />
            <div
                className={Home5.label}
                style={{ fontFamily: 'hanbitFont', opacity: isMain ? 1 : 0 }}
            >
                {element.label}
            </div>
            <div
                className={Home5.content}
                style={{ fontFamily: 'hanbitFont', opacity: isMain ? 1 : 0 }}
            >
                {element.content}
            </div>
            <button
                className={Home5.button}
                style={{ fontFamily: 'hanbitFont', opacity: isMain ? 1 : 0 }}
                onClick={() => handleNavigate(element.path.replace(" ", ""))}
            >
                {element.button}
            </button>
        </div>
    );
};

export default CarouselItem;