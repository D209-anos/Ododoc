import React, { useState, useEffect, useRef } from 'react';
import Home5 from '../../css/components/Home5.module.css'
import VscodeIcon from '../../assets/images/vscodeIcon.png'
import IntellijIcon from '../../assets/images/intellijIcon.png'
import ChromeIcon from '../../assets/images/chromeIcon.png'
import PreButton from '../../assets/images/prebutton.png'
import NextButton from '../../assets/images/nextbutton.png'

interface CarouselElement {
    src: string;
    label: string;
    content: string;
    button: string;
}

// 카로셀 요소
const carouselElements: CarouselElement[] = [
    { 
        src: VscodeIcon,
        label: 'Visual Studio Extension',
        content: '실시간으로 코드에서 발생하는\n 이슈들을 ododoc으로 전송합니다.\n 문서화 작업을 자동화함으로써\n 개발 속도를 가속화해보세요.',
        button: '자세히보기'
    },
    { 
        src: IntellijIcon, 
        label: 'IntelliJ Plugin', 
        content: 'IDE 내에서 발생하는 모든 에러를\n 자동으로 포착하여 해결책을 찾는데\n 소요되는 시간을 줄여보세요.',
        button: '자세히보기'
    },
    { 
        src: ChromeIcon,
        label: 'Chrome Extension',
        content: '웹 서핑 중 발견한 솔루션과\n 참고 자료들을 ododoc에 저장하세요. \n Editor와 통합하여 검색한 정보를\n 즉각적으로 문서에 반영합니다.',
        button: '자세히보기'
    }
];

function HomePage5() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [angle, setAngle] = useState(0);
    const [isRow, setIsRow] = useState(false);
    const [translateZ, setTranslateZ] = useState(0);
    const ratateAngle = 360 / carouselElements.length;
    const dragStartX = useRef(0);

    const handleMouseDown = (event: MouseEvent) => {
        dragStartX.current = event.clientX;
    };

    const handleMouseUp = (event: MouseEvent) => {
        const dragEndX = event.clientX;
        const dragDistance = dragEndX - dragStartX.current;
        if (Math.abs(dragDistance) > 100) {
            if (dragDistance > 0) {
                setAngle(prevAngle => prevAngle - ratateAngle);
            } else {
                setAngle(prevAngle => prevAngle + ratateAngle);
            }
        }
    };

    useEffect(() => {
        const radian = (ratateAngle / 2) * Math.PI / 180;
        const tz = Math.round((800 / 2) / Math.tan(radian));
        setTranslateZ(tz);

        // window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            // window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [angle]);

    const handlePrevClick = () => {
        setAngle(prevAngle => prevAngle - ratateAngle);
    };

    const handleNextClick = () => {
        setAngle(prevAngle => prevAngle + ratateAngle);
    };
    
    return (
        <div className={Home5.container}>
            <div className={Home5.scene}>
                <div 
                    className={`${Home5.carousel} ${isRow ? Home5.row : ''}`} 
                    ref={carouselRef}
                    style={{ transform: `rotate${isRow ? 'X' : 'Y'}(${-angle}deg)` }}
                >
                    {carouselElements.map((element, idx) => {
                        const itemAngle = ratateAngle * idx;
                        const currentAngle = (360 + angle % 360) % 360;
                        const normalizedAngle = (360 + itemAngle) % 360;
                        const isMain = normalizedAngle === currentAngle || normalizedAngle === (currentAngle + 360) % 360;

                        return (
                            <div
                                key={idx}
                                className={Home5.carouselElement}
                                style={{
                                    transform: `rotate${isRow ? 'X' : 'Y'}(${itemAngle}deg) translateZ(${translateZ}px)`,
                                    opacity: isMain ? 1 : 0.2
                                }}
                            >
                                {/* 카로셀 이미지 */}
                                <img 
                                    src={element.src} 
                                    alt={`${element.label}-icon`} 
                                    style={{ width: '100%', height: 'auto' }}/>
                                {/* 카로셀 타이틀 */}
                                <div 
                                    className={Home5.label}
                                    style={{ fontFamily: 'hanbitFont', opacity: isMain ? 1 : 0 }}
                                >
                                    {element.label}
                                </div>
                                {/* 카로셀 내용 */}
                                <div
                                    className={Home5.content}
                                    style={{ fontFamily: 'hanbitFont', opacity: isMain ? 1 : 0 }}
                                    >
                                    {element.content}
                                </div>
                                {/* 카로셀 버튼 */}
                                <button
                                    className={Home5.button}
                                    style={{ fontFamily: 'hanbitFont', opacity: isMain ? 1 : 0 }}
                                    >
                                    {element.button}
                                </button>
                            </div>
                        );
                    })}     
                </div>
                {/* 카로셀 이동 버튼 */}
                <img src={PreButton} alt="previous-button" className={Home5.preBtn} onClick={handlePrevClick}/>
                <img src={NextButton} alt="next-button" className={Home5.nextBtn} onClick={handleNextClick}/>
            </div>
        </div>
    );
}

export default HomePage5