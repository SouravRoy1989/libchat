// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/'); // Redirect to home on successful login
    } catch (err: any) {
      setError(err.message);
    }
  };

  
  return (
    <AuthLayout title="Welcome back! Please log in.">
      <form onSubmit={handleSubmit}>
        {error && <p className="mb-4 text-center text-red-400">{error}</p>}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
      <div className="mt-6 text-center">
        <button onClick={onSwitchToRegister} className="text-sm text-blue-400 hover:underline">
          Don't have an account? Sign up
        </button>
      </div>
    </AuthLayout>
  );
}