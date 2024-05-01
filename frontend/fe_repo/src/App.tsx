import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage';
import Start from './view/Start';
import Editor from './view/Editor';
<<<<<<< HEAD
import Menu from './components/Menu';
import Editor1 from './components/editor/Editor1';
import Mypage from './components/editor/Mypage';
=======
import Menu from './components/menu/Menu';
import VSCode from './components/startPage/VSCode'
>>>>>>> a8d6191e9d35ebefa3504f5f8e308f4284681418

function App() {

  return (

    <Router>
      <Menu />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/start/:selectedType' element={<Start />} />
<<<<<<< HEAD
        <Route path='/editor/*' element={<Editor />}>
        </Route>
=======
        <Route path='/editor' element={<Editor />} />
        <Route path='/editor/:id' element={<Editor />} />
        <Route path='/vscode' element={<VSCode />} />
>>>>>>> a8d6191e9d35ebefa3504f5f8e308f4284681418
      </Routes>
    </Router>
  );
}

export default App;
