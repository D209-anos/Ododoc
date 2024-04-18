// src/components/Menu.js
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import menu from '../css/components/Menu.module.css';
import CloseIcon from '@mui/icons-material/Close';

function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginBackground = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div className={menu.toggleButton} onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </div>
      {menuOpen && (
        <div className={menu.menu}>
          <ul>
            <li className={menu.loginOpenBtn} onClick={() => setLoginOpen(true)}>Login</li>
            <li><Link to="/" className={menu.clickable}>Home</Link></li>
            <li><Link to="/start" className={menu.clickable}>Start</Link></li>
            <li><Link to="/editor" className={menu.clickable}>Editor</Link></li>
          </ul>
        </div>
      )}
      {
        loginOpen &&
        <div className={menu.loginContainer} ref={loginBackground} onClick={e => {
          if (e.target === loginBackground.current) {
            setLoginOpen(false);
          }
        }}>
          <div className={menu.loginContent}>
            <div className={menu.loginTitleWrapper}>
              <p className={menu.loginTitle}>Login</p>
              <CloseIcon className={`${menu.clickable} ${menu.loginCloseBtn}`} onClick={() => setLoginOpen(false)}></CloseIcon>
            </div>
            <div className={menu.socialLoginBtnWrapper}>
              <div className={`${menu.naverBtn} ${menu.socialLoginBtn}`}></div>
              <div className={`${menu.googleBtn} ${menu.socialLoginBtn}`}></div>
              <div className={`${menu.kakaoBtn} ${menu.socialLoginBtn}`}></div>
            </div>

          </div>
        </div>
      }
    </div>
  );
}

export default Menu;
