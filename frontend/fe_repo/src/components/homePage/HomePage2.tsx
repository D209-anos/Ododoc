import { useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import VisualScreen from '../../assets/images/homePageImage/visualScreen.png'
import IntellijScreen from '../../assets/images/homePageImage/intellijScreen.png'
import EditorScreen from '../../assets/images/homePageImage/editorScreen.png'
import Home2 from '../../css/components/homePage/Home2.module.css'

function HomePage2() {
    const elementRef = useRef<HTMLElement>(null);

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
                    <div style={{ backgroundImage: `url(${EditorScreen})` }} className={Home2.editorImage} />
                    <p>IntelliJ와 Visual Studio Code에서 빌드만 하면, 깔끔히 정리된 문서를 제공해 드려요.</p>
                </div>
            </div>
        </section>
    )
}

export default HomePage2