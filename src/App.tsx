import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HomeScreen } from './pages/Home/HomeScreen';
import { RulesScreen } from './pages/Rules/RulesScreen';
import { SettingsScreen } from './pages/Settings/SettingsScreen';
import { GameScreen } from './pages/Game/GameScreen';
import { WinnerScreen } from './pages/Winner/WinnerScreen';
import { AnimatePresence } from 'framer-motion';

const GameRouter: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="min-h-screen w-full select-none overflow-x-hidden">
      <AnimatePresence mode="wait">
        {state.screen === 'home' && (
          <HomeScreen key="home" />
        )}
        {state.screen === 'rules' && (
          <RulesScreen key="rules" />
        )}
        {state.screen === 'settings' && (
          <SettingsScreen key="settings" />
        )}
        {state.screen === 'game' && (
          <GameScreen key="game" />
        )}
        {state.screen === 'winner' && (
          <WinnerScreen key="winner" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
