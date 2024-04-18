import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage';
import Start from './view/Start';
import Editor from './view/Editor';
import Menu from './components/Menu';


function App() {
  
  return (
      <Router>
        <div>
          <Menu/>
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/start' element={<Start/>}/>
            <Route path='/editor' element={<Editor/>}/>
          </Routes>
        </div>
      </Router>
  );
}

export default App;
