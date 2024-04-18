import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './view/StartPage';
import Docs from './view/Docs';
import Editor from './view/Editor'

function App() {
  
  return (
      <Router>
        <Routes>
          <Route path='/' element={<StartPage/>}/>
          <Route path='/docs' element={<Docs/>}/>
          <Route path='/editor' element={<Editor/>}/>
        </Routes>
      </Router>
  );
}

export default App;
