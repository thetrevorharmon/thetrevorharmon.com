import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  followSystem: boolean;
}

function isThemeState(value: object): value is ThemeState {
  const keys = Object.keys(value);

  if (!keys.includes('theme') || !keys.includes('followSystem')) {
    return false;
  }

  return true;
}

interface ThemeContextShape {
  themeState: ThemeState;
  setTheme: (theme: Theme | 'system') => void;
}

const ThemeContext = createContext<ThemeContextShape>({
  themeState: {theme: 'light', followSystem: true},
  setTheme: () => {},
});

interface Props {
  children: React.ReactNode;
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getSavedTheme(): ThemeState | null {
  const rawSavedTheme = localStorage.getItem('theme');

  if (rawSavedTheme == null) {
    return null;
  }

  try {
    const savedTheme = JSON.parse(rawSavedTheme);

    if (!isThemeState(savedTheme)) {
      return null;
    }

    if (savedTheme.followSystem) {
      return {
        theme: getSystemTheme(),
        followSystem: true,
      };
    } else {
      return savedTheme;
    }
  } catch {
    return null;
  }
}

export const ThemeProvider = ({children}: Props) => {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    const defaultTheme = {
      theme: getSystemTheme(),
      followSystem: true,
    };

    const savedTheme = getSavedTheme();

    return savedTheme ?? defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(themeState));
  }, [themeState]);

  useEffect(() => {
    function updateThemeWhenSystemChanges({
      matches: isDarkMode,
    }: {
      matches: boolean;
    }) {
      setThemeState((currentState) => {
        if (currentState.followSystem) {
          return {
            theme: isDarkMode ? 'dark' : 'light',
            followSystem: true,
          };
        }

        return currentState;
      });
    }

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', updateThemeWhenSystemChanges);

    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', updateThemeWhenSystemChanges);
  }, []);

  const setTheme = useCallback((theme: Theme | 'system') => {
    setThemeState(() => {
      if (theme === 'system') {
        return {
          theme: getSystemTheme(),
          followSystem: true,
        };
      }

      return {
        theme,
        followSystem: false,
      };
    });
  }, []);

  return (
    <ThemeContext.Provider value={{themeState, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const {
    themeState: {theme},
  } = useContext(ThemeContext);

  return theme;
};

export const useUpdateThemeEffect = () => {
  const theme = useTheme();

  useEffect(() => {
    if (document == null) {
      return;
    }

    const body = document.querySelector('body');

    if (body == null) {
      return;
    }

    body.classList.remove('light', 'dark');
    body.classList.add(theme);
  }, [theme]);
};

export const useThemeSetting = () => {
  const {
    themeState: {theme, followSystem},
  } = useContext(ThemeContext);

  if (followSystem) {
    return 'system';
  }

  return theme;
};

export const useSetThemeSetting = () => {
  const {setTheme} = useContext(ThemeContext);

  return setTheme;
};
