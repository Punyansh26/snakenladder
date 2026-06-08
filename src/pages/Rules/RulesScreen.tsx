import React from 'react';
import { useGame } from '../../context/GameContext';
import { ScreenWrapper } from '../../components/Animations/ScreenWrapper';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { THEME_CONFIGS } from '../../utils/themes';
import { FaArrowLeft } from 'react-icons/fa';

export const RulesScreen: React.FC = () => {
  const { state, goToScreen } = useGame();
  const activeTheme = THEME_CONFIGS[state.theme];

  return (
    <ScreenWrapper className={`${activeTheme.bodyBg} transition-colors duration-500`}>
      <div className="max-w-xl w-full flex flex-col gap-6">
        
        {/* Title */}
        <h1 className={`text-center text-3xl md:text-4xl ${activeTheme.fontHeading} bg-gradient-to-r ${activeTheme.titleGradient} bg-clip-text text-transparent`}>
          How To Play
        </h1>

        {/* Scrollable Rules Container */}
        <Card className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] pr-2 scrollbar-thin">
          
          {/* Section 1: Objective */}
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
              🏆 Objective
            </h3>
            <p className={`text-sm opacity-90 leading-relaxed ${activeTheme.fontBody}`}>
              Be the first player to navigate through the 10x10 grid and land **exactly** on tile **100**!
            </p>
          </div>

          <hr className="border-white/10" />

          {/* Section 2: Core Rules */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              🎲 Core Rules
            </h3>
            <ol className={`list-decimal list-inside text-sm opacity-90 leading-relaxed space-y-2 ${activeTheme.fontBody}`}>
              <li>
                Take turns rolling the animated 3D die. Tokens move step-by-step from cell to cell.
              </li>
              <li>
                <span className="text-amber-400 font-bold">Ladders:</span> If you land on the bottom of a ladder, you automatically climb to the top, leaping ahead!
              </li>
              <li>
                <span className="text-red-400 font-bold">Snakes:</span> If you land on a snake's head, you slide down its body to its tail, dropping backward!
              </li>
              <li>
                <span className="text-fuchsia-400 font-bold">Lucky Six:</span> Rolling a **6** awards you an immediate **extra turn** and gives you a random **power-up card**!
              </li>
              <li>
                <span className="text-cyan-400 font-bold">Exact Landing:</span> You must roll the exact number required to reach 100. If your roll is too high, you overshoot and stay at your current tile.
              </li>
            </ol>
          </div>

          <hr className="border-white/10" />

          {/* Section 3: Power-ups */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2.5 flex items-center gap-2">
              🛡️ Power-Ups (Strategy Mode)
            </h3>
            <p className={`text-xs opacity-75 mb-3 leading-relaxed ${activeTheme.fontBody}`}>
              In Strategy Mode, you start with one card of each type. Activate a card before rolling to trigger its effect. Earn more by rolling a 6!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Shield */}
              <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex gap-2.5">
                <span className="text-2xl self-start">🛡️</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Shield</h4>
                  <p className="text-[11px] opacity-75 mt-0.5">Passive. Automatically consumes 1 charge to block slides when landing on a snake.</p>
                </div>
              </div>

              {/* Reroll */}
              <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex gap-2.5">
                <span className="text-2xl self-start">🔄</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Reroll</h4>
                  <p className="text-[11px] opacity-75 mt-0.5">Active. Tap on your turn *before* rolling. Allows you to discard your roll outcome and roll again.</p>
                </div>
              </div>

              {/* Boost */}
              <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex gap-2.5">
                <span className="text-2xl self-start">⚡</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Boost</h4>
                  <p className="text-[11px] opacity-75 mt-0.5">Active. Pre-roll. Adds a flat **+2** to whatever you roll, helping you leap over snake zones.</p>
                </div>
              </div>

              {/* Safe */}
              <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex gap-2.5">
                <span className="text-2xl self-start">🟢</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">Safe Roll</h4>
                  <p className="text-[11px] opacity-75 mt-0.5">Active. Pre-roll. Replaces standard die (1-6) with a safe die (1-3) to carefully bypass hazards.</p>
                </div>
              </div>
            </div>
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
export default RulesScreen;
