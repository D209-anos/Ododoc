import React, { useRef, useEffect } from 'react';
import Intellij from '../../css/components/startPage/intellij.module.css';
import { ReactComponent as Explain1 } from '../../assets/svg/Explain1.svg';
import { ReactComponent as Explain2 } from '../../assets/svg/Explain2.svg';
import { ReactComponent as Explain3 } from '../../assets/svg/Explain3.svg';
import { ReactComponent as Explain4 } from '../../assets/svg/Explain4.svg';
import { ReactComponent as Explain5 } from '../../assets/svg/Explain5.svg';

const IntelliJ: React.FC = () => {
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        const initializePaths = () => {
            pathRefs.current.forEach((path) => {
                if (path) {
                    path.style.strokeDasharray = `${path.getTotalLength()}`;
                    path.style.strokeDashoffset = `${path.getTotalLength()}`;
                    path.classList.remove(Intellij.draw);
                }
            });
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const pathElement = entry.target as SVGPathElement;
                    pathElement.classList.add(Intellij.draw);
                    pathElement.addEventListener('animationend', () => {
                        pathElement.style.strokeDashoffset = '0';
                        pathElement.classList.remove(Intellij.draw);
                    }, { once: true });
                }
            });
        };

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -400px 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        initializePaths();

        pathRefs.current.forEach((path) => {
            if (path) {
                observer.observe(path);
            }
        });

        return () => {
            pathRefs.current.forEach((path) => {
                if (path) {
                    observer.unobserve(path);
                }
            });
        };
    }, []);

    return (
        <div className={Intellij.vscodeGuide}>
            <div className={Intellij.guideTitle}>
                <p className={Intellij.guide}>IntelliJ 확장 프로그램 설치 및 활용 가이드</p>
            </div>
            <div className={Intellij.header}>
                <Explain1 ref={(el) => (pathRefs.current[0] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path1}`}/>
            </div>
            <div className={Intellij.content1}>
                <Explain2 ref={(el) => (pathRefs.current[1] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path2}`}/>
            </div>
            <div className={Intellij.content2}>
                <Explain3 ref={(el) => (pathRefs.current[2] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path3}`}/>
            </div>
            <div className={Intellij.content3}>
                <Explain4 ref={(el) => (pathRefs.current[3] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path4}`}/>
            </div>
            <div className={Intellij.content4}>
                <Explain5 ref={(el) => (pathRefs.current[4] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path5}`}/>
            </div>
            <div className={Intellij.footer}></div>
        </div>
    )
}

export default IntelliJ;