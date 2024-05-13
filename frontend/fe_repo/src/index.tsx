import React from 'react';
import ReactDOM from 'react-dom/client';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext'
import { FileProvider } from '../src/contexts/FileContext'
import { TrashProvider } from './contexts/TrashContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <FileProvider>
          <TrashProvider>
            <App />
          </TrashProvider>
        </FileProvider>
      </AuthProvider>
    </DndProvider>
  </React.StrictMode>
);
reportWebVitals();
