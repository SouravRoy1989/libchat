import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      alert('Registration successful! Please log in.');
      onSwitchToLogin();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout title="Create your account.">
      <form onSubmit={handleSubmit}>
        {error && <p className="mb-4 text-center text-red-400">{error}</p>}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border-gray-600 bg-gray-700 p-3 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            required
          />
        </div>
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
          className="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          Create Account
        </button>
      </form>
      <div className="mt-6 text-center">
        <button onClick={onSwitchToLogin} className="text-sm text-blue-400 hover:underline">
          Already have an account? Log in
        </button>
      </div>
    </AuthLayout>
  );
}
