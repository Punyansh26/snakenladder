import React from 'react';
import { useGame } from '../../context/GameContext';
import { ScreenWrapper } from '../../components/Animations/ScreenWrapper';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { THEME_CONFIGS } from '../../utils/themes';
import type { ThemeType } from '../../types/game';
import { FaArrowLeft, FaUndo } from 'react-icons/fa';

export const SettingsScreen: React.FC = () => {
  const { 
    state, changeTheme, changeVolume, changeAnimationSpeed, 
    resetGameProgress, goToScreen 
  } = useGame();
  
  const activeTheme = THEME_CONFIGS[state.theme];

  const handleReset = () => {
    const confirm = window.confirm(
      "Are you sure you want to reset all game data, achievements, and stats? This cannot be undone."
    );
    if (confirm) {
      resetGameProgress();
    }
  };

  const themesList: { key: ThemeType; name: string }[] = [
    { key: 'classic', name: 'Classic Wood' },
    { key: 'neon', name: 'Neon Cyberpunk' },
    { key: 'space', name: 'Space Galaxy' },
    { key: 'jungle', name: 'Jungle Nature' }
  ];

  return (
    <ScreenWrapper className={`${activeTheme.bodyBg} transition-colors duration-500`}>
      <div className="max-w-md w-full flex flex-col gap-6">
        
        {/* Title */}
        <h1 className={`text-center text-3xl md:text-4xl ${activeTheme.fontHeading} bg-gradient-to-r ${activeTheme.titleGradient} bg-clip-text text-transparent`}>
          Settings
        </h1>

        {/* Configuration Card */}
        <Card className="flex flex-col gap-5">
          
          {/* Section 1: Themes */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-white text-left">🎨 Theme Selection</span>
            <div className="grid grid-cols-2 gap-2">
              {themesList.map(t => (
                <button
                  key={t.key}
                  onClick={() => changeTheme(t.key)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    state.theme === t.key
                      ? 'bg-fuchsia-600 border-fuchsia-400 text-white shadow-md'
                      : 'bg-black/20 border-white/10 text-current hover:bg-black/35'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Section 2: Audio */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white text-left">🔊 Audio Control</span>
            
            {/* Music */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>Ambient Music</span>
                <span className="font-bold">{Math.round(state.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.musicVolume}
                onChange={(e) => changeVolume('music', parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
            </div>

            {/* SFX */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>Sound Effects (SFX)</span>
                <span className="font-bold">{Math.round(state.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={state.sfxVolume}
                onChange={(e) => changeVolume('sfx', parseFloat(e.target.value))}
                className="w-full accent-fuchsia-500 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
              />
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Section 3: Animation Speed */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-white text-left">⚡ Animation Speed</span>
            <div className="flex bg-black/25 p-1 rounded-xl border border-white/5">
              {[0.5, 1, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeAnimationSpeed(speed)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    state.animationSpeed === speed
                      ? 'bg-fuchsia-600 text-white shadow-sm'
                      : 'text-current opacity-70 hover:opacity-100'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <hr className="border-white/10" />

          {/* Section 4: Data Reset */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-rose-400 font-semibold text-left">⚠️ Danger Zone</span>
            <Button
              type="danger"
              onClick={handleReset}
              className="w-full text-sm py-2.5 flex items-center justify-center gap-2"
            >
              <FaUndo className="text-xs" /> Wipe Game Progress
            </Button>
          </div>

        </Card>

        {/* Back Button */}
        <Button
          type="secondary"
          onClick={() => goToScreen('home')}
          className="self-center flex items-center gap-2"
        >
          <FaArrowLeft className="text-xs" /> Back to Menu
        </Button>

      </div>
    </ScreenWrapper>
  );
};
export default SettingsScreen;
