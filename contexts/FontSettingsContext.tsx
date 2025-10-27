import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface FontSettings {
  fontSize: number;
  fontFamily: string;
}

interface FontSettingsContextType {
  fontSettings: FontSettings;
  updateFontSize: (size: number) => void;
  updateFontFamily: (family: string) => void;
  resetFontSettings: () => void;
}

const FontSettingsContext = createContext<FontSettingsContextType | undefined>(undefined);

interface FontSettingsProviderProps {
  children: ReactNode;
}

const FONT_FAMILIES = [
  { name: 'System Default', value: 'System' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Helvetica', value: 'Helvetica' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Courier New', value: 'Courier New' },
];

const FONT_SIZES = [18, 20, 22, 24, 26, 28];

export const FontSettingsProvider: React.FC<FontSettingsProviderProps> = ({ children }) => {
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    fontSize: 18,
    fontFamily: 'System',
  });

  const updateFontSize = (size: number) => {
    setFontSettings(prev => ({ ...prev, fontSize: size }));
  };

  const updateFontFamily = (family: string) => {
    setFontSettings(prev => ({ ...prev, fontFamily: family }));
  };

  const resetFontSettings = () => {
    setFontSettings({
      fontSize: 18,
      fontFamily: 'System',
    });
  };

  const value: FontSettingsContextType = {
    fontSettings,
    updateFontSize,
    updateFontFamily,
    resetFontSettings,
  };

  return (
    <FontSettingsContext.Provider value={value}>
      {children}
    </FontSettingsContext.Provider>
  );
};

export const useFontSettings = (): FontSettingsContextType => {
  const context = useContext(FontSettingsContext);
  if (context === undefined) {
    throw new Error('useFontSettings must be used within a FontSettingsProvider');
  }
  return context;
};

export { FONT_FAMILIES, FONT_SIZES };
