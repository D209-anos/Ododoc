import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage';
import Start from './view/Start';
import Editor from './view/Editor';
import Menu from './components/Menu';
import Editor1 from './components/editor/Editor1';
import Mypage from './components/editor/Mypage';

function App() {

  return (
    <Router>
      <Menu />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/start/:selectedType' element={<Start />} />
        <Route path='/editor/*' element={<Editor />}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
