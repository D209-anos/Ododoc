<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> FE_feature/homepage
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import HomePage1 from '../components/homePage/HomePage1';
import HomePage2 from '../components/homePage/HomePage2';
import HomePage3 from '../components/homePage/HomePage3';
import HomePage4 from '../components/homePage/HomePage4';
import HomePage5 from '../components/homePage/HomePage5';
import HomePage6 from '../components/homePage/HomePage6';

<<<<<<< HEAD
function HomePage() {
  const [backgroundColor, setBackgroundColor] = useState('black');
  const [opacity, setOpacity] = useState(1);
  const [textColor, setTextColor] = useState('white');
  const [isTypingCompleted, setIsTypingCompleted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      // 배경: 검은색 -> 흰색
      if (scrollPosition <= windowHeight) {
        const newOpacity = Math.min(scrollPosition / windowHeight, 1);
        const colorValue = Math.floor(255 * newOpacity);
        setBackgroundColor(`rgb(${colorValue}, ${colorValue}, ${colorValue})`);
      }

      // 시작하는 지점에서 노란색
      if (scrollPosition >= 300 * windowHeight && scrollPosition < 400 * windowHeight) {
        const transitionProgress = 300;
        const colorValue = Math.floor(255 * transitionProgress);
        setBackgroundColor(`rgb(${colorValue}, ${colorValue}, ${colorValue})`);
      }

      // // 끝나는 지점에서 흰색
      // if (scrollPosition >= 400 * windowHeight && scrollPosition < 500 * windowHeight) {
      //   const transitionProgress = (scrollPosition - 400 * windowHeight) / (100 * windowHeight);
      //   const colorValue = Math.floor(255 * transitionProgress);
      //   setBackgroundColor(`rgb(255, 255, ${colorValue})`);
      // }

      // 텍스트 색상 및 기타 스타일 조정
      setOpacity(1 - (scrollPosition % windowHeight) / windowHeight);
      const newTextColor = scrollPosition > windowHeight / 2 ? 'black' : 'white';
      setTextColor(newTextColor);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll)
    };
  }, []);
=======
const HomePage: React.FC = () => {
  const { backgroundColor, opacity, textColor } = useScrollAnimation();
  const [isTypingCompletedPage2, setIsTypingCompletedPage2] = useState(false);
>>>>>>> FE_feature/homepage

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <HomePage1 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} />
<<<<<<< HEAD
      <HomePage2 setTypingCompleted={setIsTypingCompleted}></HomePage2>
=======
      <HomePage2 setTypingCompleted={setIsTypingCompletedPage2}></HomePage2>
>>>>>>> FE_feature/homepage
      <HomePage3 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor}></HomePage3>
      <HomePage4></HomePage4>
      <HomePage5></HomePage5>
      <HomePage6></HomePage6>
    </div>
  )
}


export default HomePage;