import React, { useEffect, useRef } from 'react';
import VisualScreen from '../../assets/images/visualScreen.png'
import IntellijScreen from '../../assets/images/intellijScreen.png'
import EditorScreen from '../../assets/images/editorpage.png'
import styles from '../../css/components/StartPage2.module.css'

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
        <div className={styles.container} ref={elementRef}>
            <div className={`${styles.halfContainerSide} ${styles.textSide}`}>
                <p className={styles.bmjuaFont}>빌드 감지, 문서 정리를<br/> 자동으로</p>
            </div>
            <div className={`${styles.halfContainerSide} ${styles.imageSide}`}>
                <img src={VisualScreen} alt="VisualScreen" className={styles.visualImage} />
                <img src={IntellijScreen} alt="IntellijScreen" className={styles.intellijImage} />
                <img src={EditorScreen} alt="EditorScreen" className={styles.editorImage} />
            </div>
        </div>
    )
}

export default StartPage2