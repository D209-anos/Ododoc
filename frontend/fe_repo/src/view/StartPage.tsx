import React, { useState, useEffect } from 'react';
import StartPage1 from '../components/startPage/StartPage1';


function StartPage() {
    const [backgroundColor, setBackgroundColor] = useState('black');

    useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollPosition = window.scrollY;
      const opacity = Math.min(scrollPosition / scrollHeight, 1);
      const colorValue = Math.floor(255 * opacity);
      setBackgroundColor(`rgb(${colorValue}, ${colorValue}, ${colorValue})`)
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll)
    };
  }, []);

  return(
    <div>
        <StartPage1 backgroundColor={backgroundColor} />
    </div>
  )
}

export default StartPage;