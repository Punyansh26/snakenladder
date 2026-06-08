import React from 'react';
import { motion } from 'framer-motion';

interface ScreenWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};
export default ScreenWrapper;
