// src/components/chat/Landing.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getGreeting } from '../../utils/greetings';

// This was missing from your previous code.
interface LandingProps {
  ModelSelector?: React.ElementType; // Made optional just in case
}

export default function Landing({ ModelSelector }: LandingProps) {
  const { user } = useAuth();
  const greeting = getGreeting();
  const animatedText = `${greeting}, ${user?.name || ''}`;

  
  const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex h-full flex-col items-center justify-center text-white">
      <div className="text-center">
        {ModelSelector && (
          <div className="mb-4">
            <ModelSelector />
          </div>
        )}
        
        <motion.h1
          className="text-3xl font-semibold overflow-hidden"
          variants={sentenceVariants}
          initial="hidden"
          animate="visible"
          aria-label={animatedText}
        >
          {animatedText.split('').map((char, index) => (
            <motion.span
              key={char + '-' + index}
              variants={letterVariants} 
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>
      </div>
    </div>
  );
}
