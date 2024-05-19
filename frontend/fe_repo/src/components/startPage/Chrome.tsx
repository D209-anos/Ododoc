import React, { useRef, useEffect } from 'react';
import chrome from '../../css/components/startPage/chrome.module.css';
import { ReactComponent as Explain1 } from '../../assets/svg/Explain1.svg';
import { ReactComponent as Explain2 } from '../../assets/svg/Explain2.svg';
import { ReactComponent as Explain3 } from '../../assets/svg/Explain3.svg';
import { ReactComponent as Explain4 } from '../../assets/svg/Explain4.svg';
import { ReactComponent as Explain5 } from '../../assets/svg/Explain5.svg';
import ChromeExplain0 from '../../assets/images/startPageImage/chromeExplain0.png';
import ChromeExplain1 from '../../assets/images/startPageImage/chromeExplain1.png';
import ChromeExplain2 from '../../assets/images/startPageImage/chromeExplain2.png';
import ChromeExplain3 from '../../assets/images/startPageImage/chromeExplain3.png';

const IntelliJ: React.FC = () => {
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        const initializePaths = () => {
            pathRefs.current.forEach((path) => {
                if (path) {
                    path.style.strokeDasharray = `${path.getTotalLength()}`;
                    path.style.strokeDashoffset = `${path.getTotalLength()}`;
                    path.classList.remove(chrome.draw);
                }
            });
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const pathElement = entry.target as SVGPathElement;
                    pathElement.classList.add(chrome.draw);
                    pathElement.addEventListener('animationend', () => {
                        pathElement.style.strokeDashoffset = '0';
                        pathElement.classList.remove(chrome.draw);
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
        <div className={chrome.vscodeGuide}>
            <div className={chrome.guideTitle}>
                <p className={chrome.guide}>Chrome 확장 프로그램 설치 및 활용 가이드</p>
            </div>

            {/* HEADER */}
            <div className={chrome.header}>
                <Explain1 ref={(el) => (pathRefs.current[0] = el?.querySelector('path') || null)} className={`${chrome.path} ${chrome.path1}`}/>
                <div className={chrome.imageContainer0}>
                    <p className={chrome.ExplainContent0}>1. 크롬 익스텐션에 로그인 하세요.</p>
                    <img src={ChromeExplain0} alt="chrome-explain-0" className={chrome.ChromeExplainImage0} />
                </div>
            </div>

            {/* CONTENT 1 */}
            <div className={chrome.content1}>
                <Explain2 ref={(el) => (pathRefs.current[1] = el?.querySelector('path') || null)} className={`${chrome.path} ${chrome.path2}`}/>
                <div className={chrome.imageContainer1}>
                    <p className={chrome.ExplainContent1}>2. 검색한 내용을 기록할 파일 선택 후 시작 버튼을 누르세요.</p>
                    <img src={ChromeExplain1} alt="chrome-explain-1" className={chrome.ChromeExplainImage1} />
                </div>
            </div>

            {/* CONTENT 2 */}
            <div className={chrome.content2}>
                <Explain3 ref={(el) => (pathRefs.current[2] = el?.querySelector('path') || null)} className={`${chrome.path} ${chrome.path3}`}/>
                <div className={chrome.imageContainer2}>
                    <p className={chrome.ExplainContent2}>3. 찾아볼 내용을 검색하세요.</p>
                    <img src={ChromeExplain2} alt="chrome-explain-2" className={chrome.ChromeExplainImage2} />
                </div>
                <div className={chrome.imageContainer3}>
                    <p className={chrome.ExplainContent3}>4. 검색을 마치면 중지를 누르고 종료하세요.</p>
                    <img src={ChromeExplain3} alt="chrome-explain-3" className={chrome.ChromeExplainImage3} />
                </div>
            </div>

            {/* CONTENT 3 */}
            <div className={chrome.content3}>
                <Explain4 ref={(el) => (pathRefs.current[3] = el?.querySelector('path') || null)} className={`${chrome.path} ${chrome.path4}`}/>
            </div>

            {/* CONTENT 4 */}
            <div className={chrome.content4}>
                <Explain5 ref={(el) => (pathRefs.current[4] = el?.querySelector('path') || null)} className={`${chrome.path} ${chrome.path5}`}/>
                <div className={chrome.imageContainer5}>
                    <p className={chrome.ExplainContent5}>5. ododoc을 자유롭게 즐기세요.</p>
                </div>
            </div>
            <div className={chrome.footer}></div>
        </div>
    )
}

export default IntelliJ;