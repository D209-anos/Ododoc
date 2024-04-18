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
    
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <StartPage1 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} />
      <StartPage2></StartPage2>
      <StartPage3></StartPage3>
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