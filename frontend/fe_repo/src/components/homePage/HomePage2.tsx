import { useEffect, useRef } from 'react';
import VisualScreen from '../../assets/images/homePageImage/visualScreen.png'
import IntellijScreen from '../../assets/images/homePageImage/intellijScreen.png'
import EditorScreen from '../../assets/images/editPageImage/editorpage.png'
import Home2 from '../../css/components/homePage/Home2.module.css'

function HomePage2() {
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const target = entry.target as HTMLElement;
                if (entry.isIntersecting) {
                    target.style.opacity = '1';
                } else {
                    target.style.opacity = '0';
                }
            });
        }, {
            threshold: 0.1
        });

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.disconnect();
            }
        };
    }, []);


    return (
        <section className={Home2.container} ref={elementRef}>
            <div className={`${Home2.halfContainerSide} ${Home2.textSide}`}>
                <p className={Home2.bmjuaFont}>빌드 감지, 문서 정리를<br/> 자동으로</p>
            </div>
            <div className={`${Home2.halfContainerSide} ${Home2.imageSide}`}>
                <img src={VisualScreen} alt="VisualScreen" className={Home2.visualImage} />
                <img src={IntellijScreen} alt="IntellijScreen" className={Home2.intellijImage} />
                <img src={EditorScreen} alt="EditorScreen" className={Home2.editorImage} />
            </div>
        </section>
    )
}

export default HomePage2