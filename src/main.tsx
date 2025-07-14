import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles.css'
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ModelProvider } from './contexts/ModelContext.tsx'; // <-- IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ModelProvider> {/* <-- WRAP APP WITH THIS */}
        <App />
      </ModelProvider>
    </AuthProvider>
  </React.StrictMode>,
)