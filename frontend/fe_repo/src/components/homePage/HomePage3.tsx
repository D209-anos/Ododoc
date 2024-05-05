import { useState, useEffect, useRef, useCallback } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import Home3 from '../../css/components/homePage/Home3.module.css';
import NextVector from '../../assets/images/mark/nextVector.png';
import Terminal from '../../assets/images/homePageImage/terminal.png';
import { animated, useTransition } from 'react-spring';

interface HomePage3Props {
    backgroundColor: string;
    opacity: number;
    textColor: string;
}

function HomePage3({ backgroundColor, opacity, textColor }: HomePage3Props) {
    const terminalHTML = `
        <p class="${Home3.error}">ERROR in src/view/HomePage.tsx:17:8</p>
        <p class="${Home3.TS2741}">TS2741: Property 'setTypingCompleted' is missing in type '{}' but required in type 'HomePage2Props'.</p>
        <div style="display: flex; flex-direction: column;">
            <span class="${Home3.info}">15 | <span class="${Home3.yellowText}">&lt;HomePage1</span> backgroundColor={backgroundColor} opacity={opacity} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;textColor={textColor} <span class="${Home3.yellowText}">/&gt;</span></span>
            <span class="${Home3.info}">16 | <span class="${Home3.yellowText}">&lt;HomePage2&gt;</span><span class="${Home3.yellowText}">&lt;/HomePage2&gt;</span></span>
            <span class="${Home3.info}">17 | <span class="${Home3.error}">^^^^^^^^^</span></span>
            <span class="${Home3.info}">18 | <span class="${Home3.yellowText}">&lt;HomePage3</span> backgroundColor={backgroundColor} opacity={opacity} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;textColor={textColor} <span class="${Home3.yellowText}">&gt;&lt;/HomePage3&gt;</span></span>
        </div>
    `;

    const editorCodeHTML = `
        <span style="display: flex; flex-direction: column;">
            <span class="${Home3.componentTitle}" style="margin-bottom: 20px;"># Homepage.tsx</span>
            <span class="${Home3.basic}"><span class="${Home3.component}">const</span> HomePage: React.FC = () => {</span>
            <span class="${Home3.basic}">&nbsp;<span class="${Home3.component}"> const</span> { backgroundColor, opacity, textColor } = useScrollAnimation();</span>
            <span class="${Home3.basic}">&nbsp;<span class="${Home3.component}"> const</span> [isTypingCompletedPage2, setIsTypingCompletedPage2] = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;useState(<span class="${Home3.component}">false</span>);</span>
            <span class="${Home3.component}" style="margin-bottom: 20px;">&nbsp;&nbsp;return (</span>
            <span class="${Home3.basic}">&nbsp;&nbsp;&nbsp;<<span class="${Home3.compoenent}">div</span> style={{ display: <span class="${Home3.style}">'flex'</span>, flexDirection: <span class="${Home3.style}">'column'</span> }}></span>
            <span class="${Home3.basic}">&nbsp;&nbsp;&nbsp;<<span class="${Home3.component}">HomePage1 <span class="${Home3.style}">backgroundColor</span>={backgroundColor} <span class="${Home3.style}">opacity</span>={opacity} <span class="${Home3.style}">&nbsp;&nbsp;&nbsp;&nbsp;textColor</span>={texctColor} /></span></span>
            <span class="${Home3.basic}">&nbsp;&nbsp;&nbsp;<<span class="${Home3.component} ${Home3.redWaveUnderline}">HomePage2</span>><<span class="${Home3.component}">HomePage2</span> /></span>
        <div/>
    `;

    const editorTerminalHTML = `
        <p class="${Home3.error}">ERROR in src/view/HomePage.tsx:17:8</p>
        <p class="${Home3.TS2741}">TS2741: Property 'setTypingCompleted' is missing in type '{}' but required in type 'HomePage2Props'.</p>
    `

    const { displayedHTML: displayedTerminalHTML, startTyping: startTypingTerminal, resetTyping: resetTypingTerminal } = useTypingAnimation(terminalHTML);
    const { displayedHTML: displayedEditorCodeHTML, startTyping: startTypingEditorCode, resetTyping: resetTypingEditorCode } = useTypingAnimation(editorCodeHTML);
    const { displayedHTML: displayedEditorTerminalHTML, startTyping: startTypingEditorTerminal, resetTyping: resetTypingEditorTerminal } = useTypingAnimation(editorTerminalHTML);

    const terminalRef = useRef(null);
    const editorTerminalRef = useRef(null);
    const editorCodeRef = useRef(null);
    const sectionRef = useRef<HTMLElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [visibleAni, setVisibleAni] = useState(true);
    
    useIntersectionObserver({
        ref: sectionRef,
        onIntersect: () => {
            setIsVisible(true);
            startTypingTerminal();
            startTypingEditorCode();
            startTypingEditorTerminal();
        },
        onExit: () => {
            setIsVisible(false);
            resetTypingTerminal();
            resetTypingEditorCode();
            resetTypingEditorTerminal();
        },
        threshold: 0.4
    });

    const sectionStyle = {
        opacity: isVisible ? 1 : 0.3,
        transition: 'opacity 0.8s ease-in-out'
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleAni(visible => !visible);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const vectorAnimation = useTransition(visibleAni, {
        from: { opacity: 0, transform: 'translateX(-20px)' },
        enter: { opacity: 1, transform: 'translateX(0)' },
        leave: { opacity: 0, transform: 'translateX(20px)' },
        config: { duration: 1000 },
        loop: true, // 애니메이션 계속 반복
    })

    return (
        <section className={Home3.container} ref={sectionRef} style={sectionStyle}>
            <div className={Home3.textArea}>
                <p className={`${Home3.bmjuaFont} ${Home3.heading}`}>어떤 코드로 성공 실패했는지 한눈에</p>
                <p className={`${Home3.hanbitFont} ${Home3.subheading}`}>모든 트러블 코드를 확인할 수 있어요.</p>
            </div>
            <div className={Home3.splitContainer}>
                <div className={Home3.leftHalf}>
                    <div ref={terminalRef} style={{ backgroundImage: `url(${Terminal})` }} className={Home3.Terminal}>
                        <div className={Home3.terminalErrorMessageWrapper} dangerouslySetInnerHTML={{ __html: displayedTerminalHTML }} />
                    </div>
                </div>
                <div className={Home3.rightHalf}>
                    <div className={Home3.codeblockContainer}>
                        <p className={Home3.editorTitle}>2024-05-03</p>
                        <div className={Home3.codeContainer} ref={editorCodeRef}>
                            <div className={Home3.terminalNumber}>
                                <span className={Home3.number1}>1</span>
                                <span className={Home3.number}>2</span>
                                <span className={Home3.number}>3</span>
                                <span className={Home3.number}>4</span>
                                <span className={Home3.number}>5</span>
                                <span className={Home3.number}>6</span>
                                <span className={Home3.number}>7</span>
                                <span className={Home3.number}>8</span>
                                <span className={Home3.number}>9</span>
                                <span className={Home3.number}>10</span>
                                <span className={Home3.number}>11</span>
                                <span className={Home3.number}>12</span>
                                <span className={Home3.number}>13</span>
                            </div>
                            <p className={Home3.codeContent} dangerouslySetInnerHTML={{ __html: displayedEditorCodeHTML }}></p>                            
                        </div>
                        <div className={Home3.terminalContainer} ref={editorTerminalRef}>
                            <div className={Home3.terminalContent} dangerouslySetInnerHTML={{ __html: displayedEditorTerminalHTML }}></div>
                        </div>
                    </div>
                </div>
            </div>
            {vectorAnimation((style, item) =>
                item ? (
                    <animated.div style={style}>
                        <img src={NextVector} alt="next-vector" className={Home3.NextVector}/>
                    </animated.div>
                ) : null
            )}
        </section>
    )
}

export default HomePage3