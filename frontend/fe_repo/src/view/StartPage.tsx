import React, { useState, useEffect } from 'react';
import StartPage1 from '../components/startPage/StartPage1';


function StartPage() {
    const [backgroundColor, setBackgroundColor] = useState('black');
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
    // 화면 스크롤 시 검은 배경 -> 흰 배경
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollPosition = window.scrollY;
      const maxScroll = window.innerHeight;
      const opacity = Math.min(scrollPosition / scrollHeight, 1);
      const newOpacity = Math.max(1 - scrollPosition / maxScroll, 0);
      const colorValue = Math.floor(255 * opacity);
      setBackgroundColor(`rgb(${colorValue}, ${colorValue}, ${colorValue})`)
      setOpacity(newOpacity)
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll)
    };
  }, []);

  return(
    <div>
        <StartPage1 backgroundColor={backgroundColor} opacity={opacity} />
    </div>
  )
}

export default StartPage;