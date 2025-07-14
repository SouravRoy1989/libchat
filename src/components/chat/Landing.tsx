// src/components/chat/Landing.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getGreeting } from '../../utils/greetings'; // Import the new utility

interface LandingProps {
  ModelSelector: React.ElementType;
}

export default function Landing({ ModelSelector }: LandingProps) {
  const { user } = useAuth();
  const greeting = getGreeting();
  // We combine the text here to animate it as a single sentence
  const animatedText = `${greeting}, ${user?.name || ''}`;

  // Animation variants for the sentence container
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

  // Animation variants for each individual letter
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
        <div className="mb-4">
          <ModelSelector />
        </div>
        
        {/* Animated Greeting Text */}
        <motion.h1
          className="text-3xl font-semibold overflow-hidden" // overflow-hidden helps contain the animation
          variants={sentenceVariants}
          initial="hidden"
          animate="visible"
          aria-label={animatedText}
        >
          {animatedText.split('').map((char, index) => (
            <motion.span
              key={char + '-' + index}
              variants={letterVariants}
              className="inline-block" // Required for individual character transforms
            >
              {char === ' ' ? '\u00A0' : char} {/* Render space as a non-breaking space */}
            </motion.span>
          ))}
        </motion.h1>
      </div>
    </div>
  );
}
