import React from 'react';

export default function Messages() {
  return (
    // Added padding-top to account for the absolute-positioned header
    <div className="pt-24 p-4 text-center text-gray-400">
      <p>Conversation started...</p>
      {/* Chat messages will be rendered here */}
    </div>
  );
}
