import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx } from '../utils/sound';

export type TextScale = 'normal' | 'large' | 'xl';

interface AccessibilityContextType {
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    return (localStorage.getItem('mindmate_text_scale') as TextScale) || 'normal';
  });
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    return localStorage.getItem('mindmate_contrast') === 'true';
  });
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem('mindmate_motion') === 'true';
  });
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('mindmate_sound') !== 'false';
  });

  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
    localStorage.setItem('mindmate_text_scale', scale);
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem('mindmate_contrast', String(enabled));
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    localStorage.setItem('mindmate_motion', String(enabled));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    soundFx.setMuted(!enabled);
    localStorage.setItem('mindmate_sound', String(enabled));
  };

  // Sync class names to html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-scale-large', 'font-scale-xl');
    if (textScale === 'large') root.classList.add('font-scale-large');
    if (textScale === 'xl') root.classList.add('font-scale-xl');

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    soundFx.setMuted(!soundEnabled);
  }, [textScale, highContrast, reducedMotion, soundEnabled]);

  return (
    <AccessibilityContext.Provider
      value={{
        textScale,
        setTextScale,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
