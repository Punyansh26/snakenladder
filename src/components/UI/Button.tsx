import React from 'react';
import { motion } from 'framer-motion';
import { audioSynth } from '../../utils/audioSynth';
import { useGame } from '../../context/GameContext';
import { THEME_CONFIGS } from '../../utils/themes';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'danger' | 'ghost';
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'primary',
  id,
}) => {
  const { state } = useGame();
  const theme = THEME_CONFIGS[state.theme];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    audioSynth.playClick();
    if (onClick) onClick(e);
  };

  // Build type styling classes
  let typeClasses = '';
  switch (type) {
    case 'primary':
      typeClasses = theme.primaryButton;
      break;
    case 'secondary':
      typeClasses = theme.secondaryButton;
      break;
    case 'danger':
      typeClasses = 'bg-rose-600 hover:bg-rose-700 text-white shadow-md border border-rose-800 rounded-lg transform hover:-translate-y-0.5 active:translate-y-0';
      break;
    case 'ghost':
      typeClasses = 'bg-transparent hover:bg-white/10 text-current border border-transparent';
      break;
  }

  return (
    <motion.button
      id={id}
      disabled={disabled}
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${typeClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
};
export default Button;
