// src/App.tsx

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';

// This component protects routes that require a user to be logged in.
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show a loading indicator while the session is being checked.
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center bg-zinc-800 text-white">Loading...</div>;
  }

  // If a user is logged in, show the nested route (ChatPage).
  // Otherwise, redirect to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// This component handles routes that should only be seen by logged-out users.
const PublicRoute = () => {
    const { user, loading } = useAuth();
  
    if (loading) {
      return <div className="flex h-screen w-full items-center justify-center bg-zinc-800 text-white">Loading...</div>;
    }
  
    // If a user is logged in, redirect them away from the login page to the main app.
    return user ? <Navigate to="/" replace /> : <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Route: The chat interface is only accessible when logged in. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ChatPage />} />
        </Route>

        {/* Public Route: The login/register page is only accessible when logged out. */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>
        
        {/* A fallback to redirect any unknown URL to the main page. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;