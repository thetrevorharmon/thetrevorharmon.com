import React, {useContext, useEffect, useState} from 'react';

export enum Theme {
  Light = 'Light',
  Dark = 'Dark',
}

interface ThemeContext {
  theme: Theme;
  toggleTheme(): void;
}

const ThemeContext = React.createContext<ThemeContext>({
  theme: Theme.Light,
  toggleTheme: () => {
    throw new Error('You forgot to wrap your theme consumer with a provider');
  },
});

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const THEME_COOKIE_NAME = 'theme';
  const [theme, setTheme] = useState<Theme>(Theme.Light);

  useEffect(() => {
    const savedTheme = loadTheme();

    if (savedTheme != null) {
      setTheme(savedTheme);
    } else if (
      window.matchMedia('(prefers-color-scheme: dark)').matches === true
    ) {
      setTheme(Theme.Dark);
      saveTheme(Theme.Dark);
    }
  }, []);

  const saveTheme = (themeToSave: Theme) => {
    localStorage.setItem(THEME_COOKIE_NAME, JSON.stringify(themeToSave));
  };

  const loadTheme = (): Theme | null => {
    const savedCookie = localStorage.getItem(THEME_COOKIE_NAME);

    if (savedCookie != '' && savedCookie != null) {
      const savedTheme = JSON.parse(savedCookie);
      if (savedTheme) {
        return savedTheme as Theme;
      }
    }

    return null;
  };

  const toggleTheme = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

const useToggleTheme = () => {
  const {toggleTheme} = useContext(ThemeContext);
  return toggleTheme;
};

const useTheme = () => {
  const {theme} = useContext(ThemeContext);
  return theme;
};

export {ThemeContext, ThemeProvider, useToggleTheme, useTheme};
