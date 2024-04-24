// src/components/Menu.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import menu from '../css/components/Menu.module.css';
import Login from '../components/login/Login'

function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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
      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)}/>
    </div>
  );
}

export default Menu;
