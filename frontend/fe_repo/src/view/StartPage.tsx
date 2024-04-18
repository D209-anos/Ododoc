import React, { useState, useEffect } from 'react';
import StartPage1 from '../components/startPage/StartPage1';
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
      const scrollHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollPosition = window.scrollY;
      const maxScroll = window.innerHeight;
      const opacity = Math.min(scrollPosition / scrollHeight, 1);
      const newOpacity = Math.max(1 - scrollPosition / maxScroll, 0);
      const colorValue = Math.floor(255 * opacity);
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
    <>
      <StartPage1 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} />
      <div className={startPage.toggleButton} onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon/>
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
    </>
  )
}

export default StartPage;