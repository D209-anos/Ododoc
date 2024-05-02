import React, { useState, useEffect } from 'react';
import Home3 from '../../css/components/homePage/Home3.module.css'
import EditorErrorPage from '../../assets/images/homePageImage/editorErrorpage.png'
import NextVector from '../../assets/images/mark/nextVector.png'
import Terminal from '../../assets/images/homePageImage/terminal.png'

interface HomePage3Props {
    backgroundColor: string;
    opacity: number;
    textColor: string;
}

function HomePage3({ backgroundColor, opacity, textColor }: HomePage3Props) {
    const initialHTML = `
        <p class="${Home3.error}">ERROR in src/view/HomePage.tsx:17:8</p>
        <p class="${Home3.TS2741}">TS2741: Property 'setTypingCompleted' is missing in type '{}' but required in type 'HomePage2Props'.</p>
        <div style="display: flex; flex-direction: column;">
            <span class="${Home3.info}">15 | <span class="${Home3.yellowText}">&lt;HomePage1</span> backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} <span class="${Home3.yellowText}">/&gt;</span></span>
            <span class="${Home3.info}">16 | <span class="${Home3.yellowText} ${Home3.redWaveUnderline}">&lt;HomePage2&gt;</span><span class="${Home3.yellowText}">&lt;/HomePage2&gt;</span></span>
            <span class="${Home3.info}">17 | <span class="${Home3.yellowText}">&lt;HomePage3</span> backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} <span class="${Home3.yellowText}">&gt;&lt;/HomePage3&gt;</span></span>
        </div>
    `;
    const [displayedHTML, setDisplayedHTML] = useState('');         // 타이핑 출력 문자
    const [index, setIndex] = useState(0);                          // 타이핑 글자 인덱스

    useEffect(() => {
        const timer = setInterval(() => {
            if (index >= initialHTML.length) {
                clearInterval(timer);
                return;
            }

            const nextChar = initialHTML.charAt(index);
            if (nextChar === '<') {
                // 태그 시작을 감지
                const endIndex = initialHTML.indexOf('>', index);
                if (endIndex !== -1) {
                    // 태그의 끝을 찾음
                    const fullTag = initialHTML.slice(index, endIndex + 1);
                    setDisplayedHTML(prev => prev + fullTag);
                    setIndex(endIndex + 1);
                }
            } else {
                // 일반 텍스트
                setDisplayedHTML(prev => prev + nextChar);
                setIndex(prev => prev + 1);
            }
        }, 10);

        return () => clearInterval(timer);
    }, [index, initialHTML]);
    
    return (
        <section className={Home3.container}>
            <div className={Home3.textArea}>
                <p className={`${Home3.bmjuaFont} ${Home3.heading}`}>어떤 코드로 성공 실패했는지 한눈에</p>
                <p className={`${Home3.hanbitFont} ${Home3.subheading}`}>모든 트러블 슈팅 코드를 확인할 수 있어요.</p>
            </div>
            <div className={Home3.splitContainer}>
                <div className={Home3.leftHalf}>
                    <div style={{ backgroundImage: `url(${Terminal})` }} className={Home3.Terminal}>
                        <div className={Home3.terminalErrorMessageWrapper} dangerouslySetInnerHTML={{ __html: displayedHTML }} />
                    </div>
                </div>
                <div className={Home3.rightHalf}>
                    <img src={EditorErrorPage} alt="editor-error-page" className={Home3.EditorErrorPage} />
                </div>
            </div>
            <img src={NextVector} alt="next-vector" className={Home3.NextVector} />
        </section>
    )
}

export default HomePage3