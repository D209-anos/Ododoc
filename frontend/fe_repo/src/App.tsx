import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage';
import Start from './view/Start';
import Editor from './view/Editor';
import Menu from './components/menu/Menu';
import LoginLoading from '../src/components/socialLogin/LoginLoading'
import Mypage from './components/editor/mypage/Mypage';


function App() {

  return (

    <Router>
      <Menu />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/start/:selectedType' element={<Start />} />
        <Route path='/editor/*' element={<Editor />}></Route>
        <Route path='/oauth' element={<LoginLoading />}></Route>
        <Route path='/editor' element={<Editor />} />
        <Route path='editor/:id' element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default App;
