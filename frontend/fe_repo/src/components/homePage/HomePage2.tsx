import React, { useEffect, useRef } from 'react';
import VisualScreen from '../../assets/images/visualScreen.png'
import IntellijScreen from '../../assets/images/intellijScreen.png'
import EditorScreen from '../../assets/images/editorpage.png'
import HomePage2 from '../../css/components/Home2.module.css'

function StartPage2() {
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
        <section className={HomePage2.container} ref={elementRef}>
            <div className={`${HomePage2.halfContainerSide} ${HomePage2.textSide}`}>
                <p className={HomePage2.bmjuaFont}>빌드 감지, 문서 정리를<br/> 자동으로</p>
            </div>
            <div className={`${HomePage2.halfContainerSide} ${HomePage2.imageSide}`}>
                <img src={VisualScreen} alt="VisualScreen" className={HomePage2.visualImage} />
                <img src={IntellijScreen} alt="IntellijScreen" className={HomePage2.intellijImage} />
                <img src={EditorScreen} alt="EditorScreen" className={HomePage2.editorImage} />
            </div>
        </section>
    )
}

export default StartPage2