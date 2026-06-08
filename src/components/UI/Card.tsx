import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { THEME_CONFIGS } from '../../utils/themes';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  delay?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  animate = true,
  delay = 0,
}) => {
  const { state } = useGame();
  const theme = THEME_CONFIGS[state.theme];

  const content = (
    <div className={`p-6 ${theme.panelBg} ${className}`}>
      {children}
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      className="w-full"
    >
      {content}
    </motion.div>
  );
};
export default Card;
