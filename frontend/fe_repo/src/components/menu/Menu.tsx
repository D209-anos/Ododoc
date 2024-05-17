import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import menu from '../../css/components/menu/Menu.module.css';
import Login from '../socialLogin/Login';
import 'animate.css';
import useHandleClickOutside from '../../hooks/useHandleClickOutside';
import { useLogout } from '../../api/service/user';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
  const { accessToken } = state;
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useHandleClickOutside(menuRef, () => {
    if (menuOpen) setMenuOpen(false);
  });

  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('authDetails');
    navigate('/');
  };

  return (
    <div>
      <div className={menu.toggleButton} onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </div>
      <div className={`${menu.menu} ${menuOpen ? menu.menuOpen : ''}`} ref={menuRef}>
        {accessToken ? (
          <>
            <div
              className={`${menu.loginOpenBtn} ${menuOpen ? 'animate__animated animate__bounceIn' : 'animate__animated animate__bounceOut'}`}
              onClick={handleLogout}
            >
              Logout
            </div>
            <div
              className={`${menu.startOpenBtn} ${menuOpen ? 'animate__animated animate__bounceIn' : 'animate__animated animate__bounceOut'}`}
              onClick={() => navigate('/start')}
            >
              Guide
            </div>
            <div
              className={`${menu.editorOpenBtn} ${menuOpen ? 'animate__animated animate__bounceIn' : 'animate__animated animate__bounceOut'}`}
              onClick={() => navigate('/editor')}
            >
              Editor
            </div>
          </>
        ) : (
          <>
            <div
              className={`${menu.loginOpenBtn} ${menuOpen ? 'animate__animated animate__bounceIn' : 'animate__animated animate__bounceOut'}`}
              onClick={() => setLoginOpen(true)}
            >
              Login
            </div>
            <div
              className={`${menu.startOpenBtn} ${menuOpen ? 'animate__animated animate__bounceIn' : 'animate__animated animate__bounceOut'}`}
              onClick={() => navigate('/start')}
            >
              Guide
            </div>
            <div
              className={`${menu.editorOpenBtn} ${menuOpen ? 'animate__animated animate__bounceIn' : 'animate__animated animate__bounceOut'}`}
              onClick={() => navigate('/')}
            >
              Home
            </div>
          </>
        )}
      </div>
      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default Menu;
