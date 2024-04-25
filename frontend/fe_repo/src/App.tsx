import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage';
import Start from './view/Start';
import Editor from './view/Editor';
import Menu from './components/Menu';
import VSCode from '../src/components/start/VSCode'


function App() {
  
  return (
      <Router>
        <div>
          <Menu/>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/start/:selectedType' element={<Start/>}/>
            <Route path='/editor' element={<Editor/>}/>
            <Route path='/vscode' element={<VSCode/>}/>
          </Routes>
        </div>
      </Router>
  );
}

export default App;
