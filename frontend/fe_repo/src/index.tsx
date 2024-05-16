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
import { DirectoryProvider } from './contexts/DirectoryContext';
import { DarkModeProvider } from './contexts/DarkModeContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <AuthProvider>
        <DarkModeProvider>
          <FileProvider>
            <DirectoryProvider>
              <TrashProvider>
                <App />
              </TrashProvider>
            </DirectoryProvider>
          </FileProvider>
        </DarkModeProvider>
      </AuthProvider>
    </DndProvider>
  </React.StrictMode>
);
reportWebVitals();
