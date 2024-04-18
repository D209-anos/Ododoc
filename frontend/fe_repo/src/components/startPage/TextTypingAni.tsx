import React, { useEffect, useState } from 'react';

interface AnimationProps {
    text: string;
}

const TextTypingAni = ({ text }: AnimationProps) => {
    const [sequence, setSequence] = useState<string>("");
    const [textCount, setTextCount] = useState<number>(0);
    const [isTypingPaused, setIsTypingPaused] = useState<boolean>(false);
    const sentences = text.split("\n");  // 문장을 개별적으로 분리
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

    useEffect(() => {
        const currentText = sentences[currentSentenceIndex];
        const typingInterval = setInterval(() => {
            if (isTypingPaused) {
                clearInterval(typingInterval);
                setTimeout(() => {
                    setIsTypingPaused(false);
                    setTextCount(0);
                    setSequence("");
                    setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length); // 다음 문장으로 넘어가기
                }, 5000); // 일시 정지 시간
                return;
            }

            if (textCount >= currentText.length) {
                setIsTypingPaused(true);
                return;
            }

            const nextChar = currentText[textCount];
            setSequence((prevSequence) => prevSequence + nextChar);

            setTextCount((prevCount) => prevCount + 1);
        }, 100); // 타이핑 속도

        return () => clearInterval(typingInterval);
    }, [currentSentenceIndex, textCount, isTypingPaused, sentences]);

    return (
        <p className="landing-p whitespace-pre-line break-normal">
            {sequence}
            <span className='inline-block align-top w-0.5 h-[1em] bg-white ml-1 blink'/>
        </p>
    );
};

export default TextTypingAni;
