import React, { useState, useEffect } from 'react';
import StartPage1 from '../components/startPage/StartPage1';
import StartPage2 from '../components/startPage/StartPage2';
import StartPage3 from '../components/startPage/StartPage3';
import startPage from '../css/view/StartPage.module.css'
import MenuIcon from '@mui/icons-material/Menu';


function StartPage() {
  const [backgroundColor, setBackgroundColor] = useState('black');
  const [opacity, setOpacity] = useState(1);
  const [textColor, setTextColor] = useState('white');

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
    
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <StartPage1 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} />
      <StartPage2></StartPage2>
      <StartPage3 backgroundColor={backgroundColor} textColor={textColor}></StartPage3>
      <div className={startPage.toggleButton} onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </div>
      {menuOpen && (
        <div className={startPage.menu}>
          <ul>
            <li>Docs</li>
            <li>Login</li>  
            <li>Editor</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default StartPage;