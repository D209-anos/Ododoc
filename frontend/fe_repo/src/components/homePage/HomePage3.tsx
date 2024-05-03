import { useState, useEffect, useRef, useCallback } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import Home3 from '../../css/components/homePage/Home3.module.css';
import NextVector from '../../assets/images/mark/nextVector.png';
import Terminal from '../../assets/images/homePageImage/terminal.png';

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
            <span class="${Home3.info}">17 | <span class="${Home3.error}">^^^^^^^^^^^^^^</span></span>
            <span class="${Home3.info}">18 | <span class="${Home3.yellowText}">&lt;HomePage3</span> backgroundColor={backgroundColor} opacity={opacity} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;textColor={textColor} <span class="${Home3.yellowText}">&gt;&lt;/HomePage3&gt;</span></span>
        </div>
    `;

    const editorCodeHTML = `
        <div style="display: flex; flex-direction: column;">
            <span class="${Home3.componentTitle}" style="margin-bottom: 15px;"># Homepage.tsx</span>
            <span class="${Home3.basic}"><span class="${Home3.component}">const</span> HomePage: React.FC = () => {</span>
            <span class="${Home3.basic}">&nbsp;<span class="${Home3.component}"> const</span> { backgroundColor, opacity, textColor } = useScrollAnimation();</span>
            <span class="${Home3.basic}">&nbsp;<span class="${Home3.component}"> const</span> [isTypingCompletedPage2, setIsTypingCompletedPage2] = &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;useState(<span class="${Home3.component}">false</span>);</span>
            <span class="${Home3.component}" style="margin-bottom: 15px;">&nbsp;&nbsp;return (</span>
            <span class="${Home3.basic}">&nbsp;&nbsp;&nbsp;<<span class="${Home3.compoenent}">div</span> style={{ display: <span class="${Home3.style}">'flex'</span>, flexDirection: <span class="${Home3.style}">'column'</span> }}></span>
            <span class="${Home3.basic}">&nbsp;&nbsp;&nbsp;<<span class="${Home3.component}">HomePage1 <span class="${Home3.style}">backgroundColor</span>={backgroundColor} <span class="${Home3.style}">opacity</span>={opacity} <span class="${Home3.style}">&nbsp;&nbsp;&nbsp;&nbsp;textColor</span>={texctColor} /></span></span>
            <span class="${Home3.basic}">&nbsp;&nbsp;&nbsp;<<span class="${Home3.component} ${Home3.redWaveUnderline}">HomePage2</span>><<span class="${Home3.component}">HomePage2</span> /></span>
        <div/>
    `;

    const editorTerminalHTML = `
        <p class="${Home3.error}">ERROR in src/view/HomePage.tsx:17:8</p>
        <p class="${Home3.TS2741}">TS2741: Property 'setTypingCompleted' is missing in type '{}' but required in type 'HomePage2Props'.</p>
    `
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const [displayedTetminalHTML, setDisplayedTetminalHTML] = useState('');         // 타이핑 출력 문자
    const [displayedEditorTerminalHTML, setDisplayedEditorTerminalHTML] = useState('');
    const [displayedEditorCodeHTML, setDisplayedEditorCodeHTML] = useState('');

    const terminalIndexRef = useRef(0);                          // 타이핑 글자 인덱스
    const editorTerminalIndexRef = useRef(0);
    const editorCodeIndexRef = useRef(0);
    
    const terminalRef = useRef(null);
    const editorTerminalRef = useRef(null);
    const editorCodeRef = useRef(null);

    
    const startTypingTerminal = useCallback(() => {
        const timer = setInterval(() => {
            if (terminalIndexRef.current >= terminalHTML.length) {
                clearInterval(timer);
                return;
            }

            const nextChar = terminalHTML.charAt(terminalIndexRef.current);
            if (nextChar === '<') {
                const endIndex = terminalHTML.indexOf('>', terminalIndexRef.current);
                if (endIndex !== -1) {
                    const fullTag = terminalHTML.slice(terminalIndexRef.current, endIndex + 1);
                    setDisplayedTetminalHTML(prev => prev + fullTag);
                    terminalIndexRef.current = endIndex + 1;
                }
            } else {
                setDisplayedTetminalHTML(prev => prev + nextChar);
                terminalIndexRef.current++;
            }
        }, 5);
    }, [terminalHTML]);

    const startTypingEditorTerminal = useCallback(() => {
        const timer = setInterval(() => {
            if (editorTerminalIndexRef.current >= editorTerminalHTML.length) {
                clearInterval(timer);
                return;
            }

            const nextChar = editorTerminalHTML.charAt(editorTerminalIndexRef.current);
            if (nextChar === '<') {
                const endIndex = editorTerminalHTML.indexOf('>', editorTerminalIndexRef.current);
                if (endIndex !== -1) {
                    const fullTag = editorTerminalHTML.slice(editorTerminalIndexRef.current, endIndex + 1);
                    setDisplayedEditorTerminalHTML(prev => prev + fullTag);
                    editorTerminalIndexRef.current = endIndex + 1;
                }
            } else {
                setDisplayedEditorTerminalHTML(prev => prev + nextChar);
                editorTerminalIndexRef.current++;
            }
        }, 18);
    }, [editorTerminalHTML]);

    const startTypingEditorCode = useCallback(() => {
        const timer = setInterval(() => {
            if (editorCodeIndexRef.current >= editorCodeHTML.length) {
                clearInterval(timer);
                return;
            }

            const nextChar = editorCodeHTML.charAt(editorCodeIndexRef.current);
            if (nextChar === '<') {
                const endIndex = editorCodeHTML.indexOf('>', editorCodeIndexRef.current);
                if (endIndex !== -1) {
                    const fullTag = editorCodeHTML.slice(editorCodeIndexRef.current, endIndex + 1);
                    setDisplayedEditorCodeHTML(prev => prev + fullTag);
                    editorCodeIndexRef.current = endIndex + 1;
                }
            } else {
                setDisplayedEditorCodeHTML(prev => prev + nextChar);
                editorCodeIndexRef.current++;
            }
        }, 4.8);
    }, [editorCodeHTML]);

    const resetTyping = useCallback(() => {
        setDisplayedTetminalHTML('');
        setDisplayedEditorTerminalHTML('');
        setDisplayedEditorCodeHTML('');
        terminalIndexRef.current = 0;
        editorTerminalIndexRef.current = 0;
        editorCodeIndexRef.current = 0;
    }, []);
    
    useEffect(() => {
        const terminalElement = terminalRef.current;
        const editorTerminalElement = editorTerminalRef.current;
        const editorCodeElement = editorCodeRef.current;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target === terminalElement) {
                    startTypingTerminal();
                } else if (entry.isIntersecting && entry.target === editorTerminalElement) {
                    startTypingEditorTerminal();
                } else if (entry.isIntersecting && entry.target === editorCodeElement) {
                    startTypingEditorCode();
                } else {
                    resetTyping();
                }
            });
        });

        if (terminalElement && editorTerminalElement && editorCodeElement) {
            observer.observe(terminalElement);
            observer.observe(editorTerminalElement);
            observer.observe(editorCodeElement);
        }

        return () => {
            if (terminalElement && editorTerminalElement && editorCodeElement) {
                observer.unobserve(terminalElement);
                observer.unobserve(editorTerminalElement);
                observer.unobserve(editorCodeElement);
            }
        };
    }, [startTypingTerminal, startTypingEditorTerminal, startTypingEditorCode, resetTyping]);

    useIntersectionObserver({
        ref: sectionRef,
        onIntersect: () => setIsVisible(true),
        onExit: () => setIsVisible(false),
        threshold: 0.4
    });

        const sectionStyle = {
        opacity: isVisible ? 1 : 0.3,
        transition: 'opacity 0.8s ease-in-out'
    };

    return (
        <section className={Home3.container} ref={sectionRef} style={sectionStyle}>
            <div className={Home3.textArea}>
                <p className={`${Home3.bmjuaFont} ${Home3.heading}`}>어떤 코드로 성공 실패했는지 한눈에</p>
                <p className={`${Home3.hanbitFont} ${Home3.subheading}`}>모든 트러블 슈팅 코드를 확인할 수 있어요.</p>
            </div>
            <div className={Home3.splitContainer}>
                <div className={Home3.leftHalf}>
                    <div ref={terminalRef} style={{ backgroundImage: `url(${Terminal})` }} className={Home3.Terminal}>
                        <div className={Home3.terminalErrorMessageWrapper} dangerouslySetInnerHTML={{ __html: displayedTetminalHTML }} />
                    </div>
                </div>
                <div className={Home3.rightHalf}>
                    <div className={Home3.codeblockContainer}>
                        <p className={Home3.editorTitle}>2024-05-03</p>
                        <hr className={Home3.line}/>
                        <div className={Home3.codeContainer} ref={editorCodeRef}>
                            <p className={Home3.codeContent} dangerouslySetInnerHTML={{ __html: displayedEditorCodeHTML }}></p>                            
                        </div>
                        <div className={Home3.terminalContainer} ref={editorTerminalRef}>
                            <div className={Home3.terminalContent} dangerouslySetInnerHTML={{ __html: displayedEditorTerminalHTML }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <img src={NextVector} alt="next-vector" className={Home3.NextVector} />
        </section>
    )
}

export default HomePage3