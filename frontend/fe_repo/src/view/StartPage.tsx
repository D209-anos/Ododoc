import React, { useState, useEffect, useRef } from 'react';
import StartPage1 from '../components/startPage/StartPage1';
import StartPage2 from '../components/startPage/StartPage2';
import StartPage3 from '../components/startPage/StartPage3';
import StartPage4 from '../components/startPage/StartPage4';
import StartPage6 from '../components/startPage/StartPage6';
import startPage from '../css/view/StartPage.module.css'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

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

  const [loginOpen, setLoginOpen] = useState(false);
  const loginBackground = useRef<HTMLDivElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <StartPage1 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} />
      <StartPage2></StartPage2>
      <StartPage3></StartPage3>
      <StartPage4></StartPage4>
      <StartPage6></StartPage6>
      <div className={startPage.toggleButton} onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </div>
      {menuOpen && (
        <div className={startPage.menu}>
          <ul>
            <li className={startPage.loginOpenBtn} onClick={() => setLoginOpen(true)}>Login</li>
            <li className={startPage.clickable}>Docs</li>
            <li className={startPage.clickable}>Editor</li>
          </ul>
        </div>
      )}
      {
        loginOpen &&
        <div className={startPage.loginContainer} ref={loginBackground} onClick={e => {
          if (e.target === loginBackground.current) {
            setLoginOpen(false);
          }
        }}>
          <div className={startPage.loginContent}>
            <div className={startPage.loginTitleWrapper}>
              <p className={startPage.loginTitle}>Login</p>
              <CloseIcon className={`${startPage.clickable} ${startPage.loginCloseBtn}`} onClick={() => setLoginOpen(false)}></CloseIcon>
            </div>
            <div className={startPage.socialLoginBtnWrapper}>
              <div className={`${startPage.naverBtn} ${startPage.socialLoginBtn}`}></div>
              <div className={`${startPage.googleBtn} ${startPage.socialLoginBtn}`}></div>
              <div className={`${startPage.kakaoBtn} ${startPage.socialLoginBtn}`}></div>
            </div>

          </div>
        </div>
      }
    </div>
  )
}

export default StartPage;