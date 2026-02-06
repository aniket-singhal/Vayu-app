import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

export const useBreathingEngine = (tech: typeof TECHNIQUES.BOX) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'HoldPost'>('Inhale');

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Speech.speak(phase === 'HoldPost' ? 'Hold' : phase, { rate: 0.9 });

    let nextPhase: typeof phase;
    let delay: number;

    switch (phase) {
      case 'Inhale':
        nextPhase = tech.hold > 0 ? 'Hold' : 'Exhale';
        delay = tech.inhale;
        break;
      case 'Hold':
        nextPhase = 'Exhale';
        delay = tech.hold;
        break;
      case 'Exhale':
        nextPhase = tech.holdPost > 0 ? 'HoldPost' : 'Inhale';
        delay = tech.exhale;
        break;
      case 'HoldPost':
        nextPhase = 'Inhale';
        delay = tech.holdPost;
        break;
    }

    const timer = setTimeout(() => setPhase(nextPhase), delay * 1000);
    return () => clearTimeout(timer);
  }, [phase, tech]);

  return { phase };
};