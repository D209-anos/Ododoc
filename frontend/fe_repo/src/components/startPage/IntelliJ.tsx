import React, { useRef, useEffect, useState } from 'react';
import Intellij from '../../css/components/startPage/intellij.module.css';
import { ReactComponent as Explain1 } from '../../assets/svg/Explain1.svg';
import { ReactComponent as Explain2 } from '../../assets/svg/Explain2.svg';
import { ReactComponent as Explain3 } from '../../assets/svg/Explain3.svg';
import { ReactComponent as Explain4 } from '../../assets/svg/Explain4.svg';
import { ReactComponent as Explain5 } from '../../assets/svg/Explain5.svg';
import IntelliJExplain0 from '../../assets/images/startPageImage/intellijExplain0.png';
import IntelliJExplain1 from '../../assets/images/startPageImage/intellijExplain1.png';
import IntelliJExplain2 from '../../assets/images/startPageImage/intellijExplain2.png';
import IntelliJExplain3 from '../../assets/images/startPageImage/intellijExplain3.png';
import IntelliJExplain4 from '../../assets/images/startPageImage/intelliJExplain4.png';
import IntelliJExplain5 from '../../assets/images/startPageImage/intelliJExplain5.png';
import IntelliJExplain6 from '../../assets/images/startPageImage/intelliJExplain6.png';

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

            {/* HEADER */}
            <div className={Intellij.header}>
                <Explain1 ref={(el) => (pathRefs.current[0] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path1}`}/>
                <div className={Intellij.imageContainer0}>
                    <p className={Intellij.ExplainContent0}>1. Settings의 Plugin에서 검색창에 "Ododoc"을 검색하고 Install 하세요.</p>
                    <img src={IntelliJExplain0} alt="intellij-explain-0" className={Intellij.IntelliJExplainImage0} />
                </div>
            </div>

            {/* CONTENT 1 */}
            <div className={Intellij.content1}>
                <Explain2 ref={(el) => (pathRefs.current[1] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path2}`}/>
                <div className={Intellij.imageContainer1}>
                    <p className={Intellij.ExplainContent1}>2. Alt + C 나 Tools의 "Ododoc" 메뉴 클릭 후 로그인하세요.</p>
                    <img src={IntelliJExplain1} alt="intelliJ-explain-1" className={Intellij.IntelliJExplainImage1}/>
                    <img src={IntelliJExplain2} alt="intelliJ-explain-2" className={Intellij.IntelliJExplainImage2} />
                </div>
            </div>
    
            {/*  CONTENT 2 */}
            <div className={Intellij.content2}>
                <Explain3 ref={(el) => (pathRefs.current[2] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path3}`}/>
                <div className={Intellij.imageContainer2}>
                    <p className={Intellij.ExplainContent2}>3. 로그인이 완료되면 사용자의 디렉토리 정보를 조회할 수 있습니다.</p>
                    <img src={IntelliJExplain3} alt="intelliJ-explain-3" className={Intellij.IntelliJExplainImage3} />
                </div>
                <div className={Intellij.imageContainer3}>
                    <p className={Intellij.ExplainContent3}>4. 폴더 및 파일을 생성하세요.</p>
                    <p className={Intellij.ExplainContent4}>- 마우스 우클릭 시 폴더 및 파일을 생성할 수 있습니다.</p>
                    <p className={Intellij.ExplainContent5}>- 폴더 및 파일을 더블 클릭할 경우 이름을 수정할 수 있습니다.</p>
                    <img src={IntelliJExplain4} alt="intelliJ-explain-4" className={Intellij.IntelliJExplainImage4} />
                    <div className={Intellij.home}>
                        <div className={Intellij.hoverBox}>ododoc 홈페이지로 이동</div>
                    </div>
                    <div className={Intellij.link}>
                        <div className={Intellij.hoverBox2}>서버 연결</div>
                    </div>
                    <div className={Intellij.restart}>
                        <div className={Intellij.hoverBox3}>새로고침</div>
                    </div>
                    <img src={IntelliJExplain5} alt="intelliJ-explain-5" className={Intellij.IntelliJExplainImage5} />
                </div>
            </div>

            {/* CONTENT 3 */}
            <div className={Intellij.content3}>
                <Explain4 ref={(el) => (pathRefs.current[3] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path4}`}/>
                <div className={Intellij.imageContainer4}>
                    <p className={Intellij.ExplainContent6}>5. 파일 클릭 후 오른쪽 마우스를 클릭하여 파일과 연동합니다.</p>
                    <p className={Intellij.ExplainContent7}>* 파일 연동 시 해당 파일로 개발 과정이 기록되며 파일을 연동하지 않을 시 자동으로 파일이 생성되어 기록됩니다.</p>
                    <img src={IntelliJExplain6} alt="intelliJ-explain-6" className={Intellij.IntelliJExplainImage6} />
                </div>
            </div>

            {/* CONTENT 4 */}
            <div className={Intellij.content4}>
                <Explain5 ref={(el) => (pathRefs.current[4] = el?.querySelector('path') || null)} className={`${Intellij.path} ${Intellij.path5}`}/>
                <div className={Intellij.imageContainer5}>
                    <p className={Intellij.ExplainContent8}>6. 이제 코드를 실행할 때마다<br/> 여러분의 개발과정이 기록됩니다!</p>
                </div>
            </div>
            <div className={Intellij.footer}></div>
        </div>
    )
}

export default IntelliJ;