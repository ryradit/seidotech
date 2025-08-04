'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedContainerProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedContainer({ 
  children, 
  delay = 0, 
  className = '' 
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.4, 0, 0.2, 1] 
      }}
      className={`${className}`}
      style={{
        background: 'linear-gradient(to right bottom, rgb(15, 23, 42), rgb(12, 74, 110))'
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className = '',
  staggerDelay = 0.1 
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={`text-white ${className}`}
      style={{
        background: 'linear-gradient(to right bottom, rgb(15, 23, 42), rgb(12, 74, 110))'
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className = '' 
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }
        }
      }}
      className={`flex items-center gap-2 ${className}`}
    >
      <span className="text-orange-500">✓</span>
      <span className="text-gray-100 hover:text-white">{children}</span>
    </motion.div>
  );
}
