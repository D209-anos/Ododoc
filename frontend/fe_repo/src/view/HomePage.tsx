import React, { useState, useEffect} from 'react';
import HomePage1 from '../components/homePage/HomePage1';
import HomePage2 from '../components/homePage/HomePage2';
import HomePage3 from '../components/homePage/HomePage3';
import HomePage4 from '../components/homePage/HomePage4';
import HomePage6 from '../components/homePage/HomePage6';

function HomePage() {
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


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <HomePage1 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} />
      <HomePage2></HomePage2>
      <HomePage3></HomePage3>
      <HomePage4></HomePage4>
      <HomePage6></HomePage6>
    </div>
  )
}


export default HomePage;