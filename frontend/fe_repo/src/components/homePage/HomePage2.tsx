import React, { useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useScrollTrigger } from '../../hooks/useScrollTrigger';
import VisualScreen from '../../assets/images/homePageImage/visualScreen.png'
import IntellijScreen from '../../assets/images/homePageImage/intellijScreen.png'
import EditorScreen from '../../assets/images/homePageImage/editorScreen.png'
import Home2 from '../../css/components/homePage/Home2.module.css'

interface HomePage2Props {
  setTypingCompleted: (completed: boolean) => void;
}

const HomePage2: React.FC<HomePage2Props> = ({ setTypingCompleted }) => {
    const elementRef = useRef<HTMLElement>(null);
    const [text, setText] = useState<string>('');
    const fullText: string = "IntelliJ와 Visual Studio Code에서 빌드만 하면,\n깔끔히 정리된 문서를 제공해 드려요.\n개발 과정 중에 만난 이슈가 자동으로 정리됩니다.";
    const textLength = fullText.length;

    // 글자 엔터 기능
    const textLines = text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
        {line}
        <br />
        </React.Fragment>
    ));

    // 스크롤 타이핑 애니메이션
    useScrollTrigger({ setText, setTypingCompleted, fullText, textLength, elementRef });

    useIntersectionObserver({
        ref: elementRef,
        onIntersect: () => {
            if (elementRef.current) {
                elementRef.current.style.opacity = '1';
            }
        },
        onExit: () => {
            if (elementRef.current) {
                elementRef.current.style.opacity = '0';
            }
        },
    });

    return (
        <section className={Home2.container} ref={elementRef}>
            <div className={`${Home2.halfContainerSide} ${Home2.textSide}`}>
                <p className={Home2.bmjuaFont}>빌드 감지, 문서 정리를<br/> 자동으로</p>
            </div>
            <div className={`${Home2.halfContainerSide} ${Home2.imageSide}`}>
                <div style={{ backgroundImage: `url(${VisualScreen})` }} className={Home2.visualImage} />
                <div style={{ backgroundImage: `url(${IntellijScreen})` }} className={Home2.intellijImage} />
                <div>
                    <div style={{ backgroundImage: `url(${EditorScreen})` }} className={Home2.editorImage}>
                        <p className={Home2.editorOverlayText}>
                            {textLines}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomePage2