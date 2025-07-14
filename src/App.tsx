import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import Spinner from './components/Spinner';

function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user) {
    return <ChatPage />;
  }

  return showRegister ? (
    <RegisterPage onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginPage onSwitchToRegister={() => setShowRegister(true)} />
  );
}

export default App;
