import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Home5 from '../../css/components/homePage/Home5.module.css'
import VscodeIcon from '../../assets/images/logoImage/vscodeIcon.png'
import IntellijIcon from '../../assets/images/logoImage/intellijIcon.png'
import ChromeIcon from '../../assets/images/logoImage/chromeIcon.png'
import PreButton from '../../assets/images/mark/prebutton.png'
import NextButton from '../../assets/images/mark/nextbutton.png'
import CarouselItem from './element/CarouselItem';
import useCarouselEffect from '../../hooks/useCarouselEffect';

interface CarouselElement {
    src: string;
    label: string;
    content: string;
    button: string;
    path: string;
}

// 카로셀 요소
const carouselElements: CarouselElement[] = [
    {
        src: VscodeIcon,
        label: 'Visual Studio Extension',
        content: '실시간으로 코드에서 발생하는\n 이슈들을 ododoc으로 전송합니다.\n 문서화 작업을 자동화함으로써\n 개발 속도를 가속화해보세요.',
        button: '자세히보기',
        path: 'VSCode'
    },
    {
        src: IntellijIcon,
        label: 'IntelliJ Plugin',
        content: 'IDE 내에서 발생하는 모든 에러를\n 자동으로 포착하여 해결책을 찾는데\n 소요되는 시간을 줄여보세요.',
        button: '자세히보기',
        path: 'IntelliJ'
    },
    {
        src: ChromeIcon,
        label: 'Chrome Extension',
        content: '웹 서핑 중 발견한 솔루션과\n 참고 자료들을 ododoc에 저장하세요. \n Editor와 통합하여 검색한 정보를\n 즉각적으로 문서에 반영합니다.',
        button: '자세히보기',
        path: 'Chrome'
    }
];

function HomePage5() {
    const navigate = useNavigate()
    const carouselRef = useRef<HTMLDivElement>(null);
    const [angle, setAngle] = useState(0);
    const [translateZ, setTranslateZ] = useState(0);
    const [isRow, setIsRow] = useState(false);
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

    useCarouselEffect({
        angle,
        setTranslateZ,
        handleMouseDown,
        handleMouseUp
    })

    const handlePrevClick = () => {
        setAngle(prevAngle => prevAngle - ratateAngle);
    };

    const handleNextClick = () => {
        setAngle(prevAngle => prevAngle + ratateAngle);
    };

    const handleNavigate = (type: string) => {
        navigate(`/start/${type}`);
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
                            <CarouselItem
                                key={idx}
                                element={element}
                                itemAngle={itemAngle}
                                translateZ={translateZ}
                                isMain={isMain}
                                handleNavigate={handleNavigate}
                            />
                        );
                    })}
                </div>
                {/* 카로셀 이동 버튼 */}
                <img src={PreButton} alt="previous-button" className={Home5.preBtn} onClick={handlePrevClick} />
                <img src={NextButton} alt="next-button" className={Home5.nextBtn} onClick={handleNextClick} />
            </div>
        </div>
    );
}

export default HomePage5