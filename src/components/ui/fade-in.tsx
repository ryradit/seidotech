
'use client';

import { motion, Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeIn({
  children,
  className,
  duration = 0.5,
  delay = 0.1,
  direction = 'up',
}: FadeInProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
