import { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import menu from '../../css/components/menu/Menu.module.css';
import Login from '../socialLogin/Login';
import 'animate.css';
import useHandleClickOutside from '../../hooks/useHandleClickOutside';
import { logout } from '../../api/service/user';

function Menu() {
  const navigate = useNavigate();
  const { accessToken, setAccessToken } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showStart, setShowStart] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useHandleClickOutside(menuRef, () => {
    if (menuOpen) setMenuOpen(false);
  });

  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => setShowLogin(true), 0);
      setTimeout(() => setShowStart(true), 0);
      setTimeout(() => setShowHome(true), 0);
      setTimeout(() => setShowEditor(true), 0);
    } else {
      setTimeout(() => setShowLogin(false), 100);
      setTimeout(() => setShowStart(false), 100);
      setTimeout(() => setShowHome(false), 100);
      setTimeout(() => setShowEditor(false), 100);
    }
  }, [menuOpen])

  const handleLogout = async() => {
    await logout()
    setAccessToken(null);
    localStorage.removeItem('accessToken')
    navigate('/')
  }

  return (
    <div>
      <div className={menu.toggleButton} onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </div>
         <div className={`${menu.menu}`} ref={menuRef}>
          {accessToken ? (
            <>
              <div className={`${menu.loginOpenBtn} ${showLogin ? 'animate__animated animate__slideInUp' : 'animate__animated animate__bounceOut'}`} onClick={handleLogout}>Logout</div>
              <div className={`${menu.startOpenBtn} ${showStart ? 'animate__animated animate__slideInRight' : 'animate__animated animate__bounceOut'}`} onClick={() => navigate('/start')}>Start</div>
            </>
          ) : (
            <>
              <div className={`${menu.loginOpenBtn} ${showLogin ? 'animate__animated animate__slideInUp' : 'animate__animated animate__bounceOut'}`} onClick={() => setLoginOpen(true)}>Login</div>
              <div className={`${menu.startOpenBtn} ${showStart ? 'animate__animated animate__slideInRight' : 'animate__animated animate__bounceOut'}`} onClick={() => navigate('/start')}>Start</div>
            </>
          )}
          {/* <div className={`${menu.loginOpenBtn} ${showLogin ? 'animate__animated animate__slideInUp' : 'animate__animated animate__bounceOut'}`} onClick={() => setLoginOpen(true)}>Login</div>
          <div className={`${menu.startOpenBtn} ${showStart ? 'animate__animated animate__slideInRight' : 'animate__animated animate__bounceOut'}`} onClick={() => navigate('/start')}>Start</div>
          <div className={`${menu.editorOpenBtn} ${showEditor ? 'animate__animated animate__slideInUp' : 'animate__animated animate__bounceOut'}`} onClick={() => navigate('/editor')}>Editor</div>
          <div className={`${menu.homeOpenBtn} ${showHome ? 'animate__animated animate__slideInUp' : 'animate__animated animate__bounceOut'}`} onClick={() => navigate('/')}>Home</div> */}
        </div>
      <Login isOpen={loginOpen} onClose={() => setLoginOpen(false)}/>
    </div>
  );
}

export default Menu;