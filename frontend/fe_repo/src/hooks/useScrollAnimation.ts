import { useState, useEffect } from 'react';

export const useScrollAnimation = () => {
    const [backgroundColor, setBackgroundColor] = useState('black');
    const [opacity, setOpacity] = useState(1);
    const [textColor, setTextColor] = useState('white');
    useEffect(() => {
        // 화면 스크롤 시 검은 배경 -> 흰 배경
        const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        const maxScroll = windowHeight;
        const newOpacity = Math.min(scrollPosition / maxScroll, 1);
        const colorValue = Math.floor(255 * newOpacity);
        setBackgroundColor(`rgb(${colorValue}, ${colorValue}, ${colorValue})`)
        setOpacity(newOpacity)

        const newTextColor = scrollPosition > windowHeight / 2 ? 'black' : 'white';
        setTextColor(newTextColor);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', handleScroll)
        };
    }, []);

    return { backgroundColor, opacity, textColor}
}