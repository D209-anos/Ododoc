import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage';
import Start from './view/Start';
import Editor from './view/Editor';
import Menu from './components/menu/Menu';
import VSCode from './components/startPage/VSCode'

function App() {

  return (

    <Router>
      <Menu />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/start/:selectedType' element={<Start />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/vscode' element={<VSCode />} />
      </Routes>
    </Router>
  );
}

export default App;
