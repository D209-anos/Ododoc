import React, { useState, useEffect, useRef } from 'react';
import Home4 from '../../css/components/homePage/Home4.module.css'
import GoogleSearchScreen from '../../assets/images/homePageImage/googleSearchScreen.png'
import NextVector from '../../assets/images/mark/wheelVector.png'
import BlogScreen from '../../assets/images/homePageImage/blogScreen.png'
import OdodocScreen from '../../assets/images/homePageImage/editorScreen.png'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

function HomePage4 () {
    const googleRef = useRef<HTMLDivElement>(null);
    const blogRef = useRef<HTMLDivElement>(null);
    const ododocRef = useRef<HTMLDivElement>(null);
    const isVisibleRef = useRef(false);

    const [isVisible, setIsVisible] = useState(false);
    isVisibleRef.current = isVisible;

    const sectionRef = useRef<HTMLElement>(null);

    // 스크롤 opacity
    useIntersectionObserver({
        ref: sectionRef,
        onIntersect: () => { setIsVisible(true) },
        onExit: () => { setIsVisible(false) },
        threshold: 0.4
    });

    const sectionStyle = {
        opacity: isVisible ? 1 : 0.3,
        transition: 'opacity 0.5s ease-in-out'
    };

    // 언마운트 시 모든 ref의 opacity를 리셋
    useEffect(() => {
        return () => {
            if (googleRef.current) googleRef.current.style.opacity = '0.3';
            if (blogRef.current) blogRef.current.style.opacity = '0.3';
            if (ododocRef.current) ododocRef.current.style.opacity = '0.3';
        };
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        const fadeInOut = (element: HTMLElement, delay: number) => {
            return new Promise<void>(resolve => {
                setTimeout(() => {
                    if (!isVisibleRef.current) return;
                    element.style.opacity = '1';
                    element.style.transition = 'opacity 0.5s ease-in-out';
                    setTimeout(() => {
                        if (!isVisibleRef.current) return; 
                        element.style.opacity = '0.3';
                        resolve();
                    }, 1000);
                }, delay);
            });
        };

        const resetAndAnimate = async () => {
            while (isVisibleRef.current) {
                if (googleRef.current) await fadeInOut(googleRef.current, 1000);
                if (!isVisibleRef.current) return;
                if (blogRef.current) await fadeInOut(blogRef.current, 1000);
                if (!isVisibleRef.current) return;
                if (ododocRef.current) await fadeInOut(ododocRef.current, 1000);
            }
        };

        resetAndAnimate();

        return () => {
            setIsVisible(false)
        }
    }, [isVisible]);

        
    return(
        <>
        <section className={Home4.componentContainer} ref={sectionRef} style={sectionStyle}>
            <div className={Home4.textWrapper}>
                <p className={Home4.textTitle}>내가 검색한 내용도 깔끔하게.</p>
                <p className={Home4.textContent}>
                    방문한 사이트의 내용도 
                    <span className={Home4.highlight}> 요약</span>해 드립니다.
                </p>
            </div>
            <div className={Home4.summarySiteContent}>
                {/* 1. 구글 검색 */}
                <div ref={googleRef} className={Home4.googleSearchWrapper} style={{ opacity: 0.3 }}>
                    <p className={Home4.googleSearchText}>1. 크롬 브라우저에서 검색하세요.</p>
                    <div className={Home4.chromeSearchScreen} style={{ backgroundImage: `url(${GoogleSearchScreen})` }}></div>
                </div>
                {/* 2. 블로그 검색 */}
                <div ref={blogRef} className={Home4.blogSearchWrapper} style={{ opacity: 0.3 }}>
                    <p className={Home4.infoSearchText}>2. 정보를 탐색하세요.</p>
                    <img src={NextVector} alt="next-vector" className={Home4.firstVector}/>
                    <img src={BlogScreen} alt="blog-screen" className={Home4.blogScreen}/>
                </div>
                {/* 3. ododoc 화면 */}
                <div ref={ododocRef} className={Home4.ododocPageWrapper} style={{ opacity: 0.3 }}>
                    <p className={Home4.ododocInfoText}>3. ododoc을 확인하세요.</p>
                    <img src={NextVector} alt="next-vector" className={Home4.secondVector}/>
                    <div className={Home4.ododocScreen} style={{ backgroundImage: `url(${OdodocScreen})` }}>
                        <div className={Home4.ododocSummary}>
                            <p className={Home4.date}>2024-05-03</p>
                            <p># 타입스크립트 TS2741 에러</p>
                            <div className={Home4.ododocTerminal}>
                                <p className={Home4.errorMessage}>ERROR in src/view/Homepage.tsx:17:8</p>
                                <p className={Home4.detailErrorMessage}>TS2741: Property 'setTypingCompleted'is missing in type '{}' but required in type 'HomePage2Props'.</p>
                            </div>
                            <p className={Home4.ododocText}>
                                <br />
                                발생한 에러는 HomePage2Props라는 타입에서<br />  'setTypingCompleted' 속성이 필요하지만, 해당 속성이 전달되지 않았다는 것을 의미합니다.<br />
                                <br /> 일반적으로 TS2741 오류는 다음과 같은 상황에서 발생합니다. <br />
                                <br /> 1. 컴포넌트 Props가 정의된 타입과 실제 전달되는 Props가 일치하지 않는 경우
                                <br /> 2. 컴포넌트 Props의 필수 속성이 전달되지 않는 경우
                                <br /> 3. 상위 컴포넌트에서 필요한 Props를 하위 컴포넌트로 전달하지 않은 경우
                            </p>
                            <p>

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

export default HomePage4;