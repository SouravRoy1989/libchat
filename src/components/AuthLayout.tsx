import React, { ReactNode } from 'react';
import Logo from './Logo';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-6 text-2xl font-bold text-white">PWC OpenChat</h1>
          <p className="mt-2 text-gray-400">{title}</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
