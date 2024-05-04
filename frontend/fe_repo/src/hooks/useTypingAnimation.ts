import { useCallback, useRef, useState } from 'react';

interface TypingAnimationHook {
    displayedHTML: string;
    startTyping: () => void;
    resetTyping: () => void;
}

export const useTypingAnimation = (htmlContent: string, initialDelay: number = 90): TypingAnimationHook => {
    const [displayedHTML, setDisplayedHTML] = useState<string>('');
    const indexRef = useRef<number>(0);

    const startTyping = useCallback(() => {
        const timer = setInterval(() => {
            if (indexRef.current >= htmlContent.length) {
                clearInterval(timer);
                return;
            }

            const nextChar = htmlContent.charAt(indexRef.current);
            if (nextChar === '<') {
                const endIndex = htmlContent.indexOf('>', indexRef.current);
                if (endIndex !== -1) {
                    const fullTag = htmlContent.slice(indexRef.current, endIndex + 1);
                    setDisplayedHTML(prev => prev + fullTag);
                    indexRef.current = endIndex + 1;
                }
            } else {
                setDisplayedHTML(prev => prev + nextChar);
                indexRef.current++;
            }
        }, initialDelay);

        return () => clearInterval(timer);
    }, [htmlContent, initialDelay]);

    const resetTyping = useCallback(() => {
        setDisplayedHTML('');
        indexRef.current = 0;
    }, []);

    return { displayedHTML, startTyping, resetTyping }
};