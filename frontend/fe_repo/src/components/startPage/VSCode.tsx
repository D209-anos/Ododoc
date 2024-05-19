import React, { useRef, useEffect } from 'react';
import Vscode from '../../css/components/startPage/vscode.module.css';
import { ReactComponent as Explain1 } from '../../assets/svg/Explain1.svg';
import { ReactComponent as Explain2 } from '../../assets/svg/Explain2.svg';
import { ReactComponent as Explain3 } from '../../assets/svg/Explain3.svg';
import { ReactComponent as Explain4 } from '../../assets/svg/Explain4.svg';
import { ReactComponent as Explain5 } from '../../assets/svg/Explain5.svg';
import VscodeExplain0 from '../../assets/images/startPageImage/vscodeExplain0.png';
import VscodeExplain1 from '../../assets/images/startPageImage/vscodeExplain1.png';
import VscodeExplain2 from '../../assets/images/startPageImage/vscodeExplain2.png';
import VscodeExplain3 from '../../assets/images/startPageImage/vscodeExplain3.png';
import VscodeExplain4 from '../../assets/images/startPageImage/vscodeExplain4.png';
import Check from '../../assets/images/icon/redCheckIcon.png';

const VSCode: React.FC = () => {
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        const initializePaths = () => {
            pathRefs.current.forEach((path) => {
                if (path) {
                    path.style.strokeDasharray = `${path.getTotalLength()}`;
                    path.style.strokeDashoffset = `${path.getTotalLength()}`;
                    path.classList.remove(Vscode.draw);
                }
            });
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const pathElement = entry.target as SVGPathElement;
                    pathElement.classList.add(Vscode.draw);
                    pathElement.addEventListener('animationend', () => {
                        pathElement.style.strokeDashoffset = '0';
                        pathElement.classList.remove(Vscode.draw);
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
        <div className={Vscode.vscodeGuide}>
            <div className={Vscode.guideTitle}>
                <p className={Vscode.guide}>VSCode 확장 프로그램 설치 및 활용 가이드</p>
            </div>

            {/* HEADER */}
            <div className={Vscode.header}>
                <Explain1 ref={(el) => (pathRefs.current[0] = el?.querySelector('path') || null)} className={`${Vscode.path} ${Vscode.path1}`}/>
                <div className={Vscode.imageContainer0}>
                    <p className={Vscode.ExplainContent0}>1. VSCode Extentions Marketplace에서 "ododoc"을 검색하세요.</p>
                    <img src={VscodeExplain0} alt="vscode-explain-0" className={Vscode.VscodeExplainImage0}/>
                </div>
            </div>
            
            {/* CONTENT 1 */}
            <div className={Vscode.content1}>
                <Explain2 ref={(el) => (pathRefs.current[1] = el?.querySelector('path') || null)} className={`${Vscode.path} ${Vscode.path2}`}/>
                <div className={Vscode.imageContainer1}>
                    <p className={Vscode.ExplainContent1}>2. "ododoc" 익스텐션을 install 하세요.</p>
                    <img src={VscodeExplain1} alt="vscode-explain-1" className={Vscode.VscodeExplainImage1}/>
                </div>
            </div>

            {/* CONTENT 2 */}
            <div className={Vscode.content2}>
                <Explain3 ref={(el) => (pathRefs.current[2] = el?.querySelector('path') || null)} className={`${Vscode.path} ${Vscode.path3}`}/>
                <div className={Vscode.imageContainer2}>
                    <p className={Vscode.ExplainContent2}>3. Activity Bar에서 "ododoc"을 클릭해 로그인하세요.</p>
                    <img src={VscodeExplain2} alt="vscode-explain-2" className={Vscode.VscodeExplainImage2} />
                    <img src={Check} alt="check-icon" className={Vscode.check2} />
                </div>
                <div className={Vscode.imageContainer3}>
                    <p className={Vscode.ExplainContent3}>4. ododoc에 대한 권한을 주세요.</p>
                    <img src={VscodeExplain3} alt="vscode-explain-3" className={Vscode.VscodeExplainImage3}/>
                    <img src={Check} alt="check-icon" className={Vscode.check3} />
                </div>
            </div>

            {/* CONTENT 3 */}
            <div className={Vscode.content3}>
                <Explain4 ref={(el) => (pathRefs.current[3] = el?.querySelector('path') || null)} className={`${Vscode.path} ${Vscode.path4}`}/>
                <div className={Vscode.imageContainer4}>
                    <p className={Vscode.ExplainContent4}>5. 연동할 파일을 클릭하고 알림창에서 확인 버튼을 누르세요.</p>
                    <img src={VscodeExplain4} alt="vscode-explain-4" className={Vscode.VscodeExplainImage4} />
                    <img src={Check} alt="check-icon" className={Vscode.check4} />
                    <img src={Check} alt="check-icon" className={Vscode.check5} />
                </div>
            </div>

            {/* CONTENT 4 */}
            <div className={Vscode.content4}>
                <Explain5 ref={(el) => (pathRefs.current[4] = el?.querySelector('path') || null)} className={`${Vscode.path} ${Vscode.path5}`}/>
                <div className={Vscode.imageContainer5}>
                    <p className={Vscode.ExplainContent5}>6. 이제 마음껏 ododoc을 즐겨보세요.</p>
                </div>
            </div>

            {/* FOOTER */}
            <div className={Vscode.footer}></div>
        </div>
    )
}

export default VSCode;