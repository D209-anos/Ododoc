import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage';
import Start from './view/Start';
import Editor from './view/Editor';
import Menu from './components/menu/Menu';
import LoginLoading from '../src/components/socialLogin/LoginLoading';
import Editor1 from './components/editor/editor/Editor1';
import Mypage from './view/Profile';
import PrivateRoute from './components/socialLogin/PrivateRouteProps';

function App() {

  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path='/' element={<HomePage />} />
        <Route path='/start' element={<Start />} />
        <Route path='/start/:selectedType' element={<Start />} />
        <Route path='/editor' element={<Editor />}>
          <Route index element={<Mypage />} />  
          <Route path=':id' element={<Editor1 />} />
          <Route path='profile' element={<Mypage />} />
        </Route>
        <Route path='/oauth' element={<LoginLoading />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
