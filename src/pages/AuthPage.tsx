// src/pages/AuthPage.tsx

import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage'; // We assume you have a RegisterPage component

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  if (showLogin) {
    return <LoginPage onSwitchToRegister={() => setShowLogin(false)} />;
  } else {
    return <RegisterPage onSwitchToLogin={() => setShowLogin(true)} />;
  }
}