// Theme store. Replaces the Gatsby ThemeContext, which needed a React provider.
//
// The source of truth is localStorage (key `theme`, value `{theme, followSystem}`,
// the same shape the old site used, so a returning visitor's choice still works).
// The inline script in BaseLayout applies the class to <html> before first paint;
// this module reads and writes the same state and re-applies it on change.
// Islands read the resolved theme from the <html> class, so they never need a provider.
import {useCallback, useSyncExternalStore} from 'react';

export type Theme = 'light' | 'dark';
export type ThemeSetting = Theme | 'system';

const STORAGE_KEY = 'theme';

interface StoredTheme {
  theme: Theme;
  followSystem: boolean;
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function readStored(): StoredTheme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed == null ||
      typeof parsed !== 'object' ||
      !('theme' in parsed) ||
      !('followSystem' in parsed)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** The user's choice: light, dark, or system (also the default). */
export function getThemeSetting(): ThemeSetting {
  const stored = readStored();
  if (stored == null || stored.followSystem) return 'system';
  return stored.theme === 'dark' ? 'dark' : 'light';
}

/** The theme that is actually showing, read from the <html> class. */
function getAppliedTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

export function setThemeSetting(setting: ThemeSetting) {
  const theme = setting === 'system' ? systemTheme() : setting;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({theme, followSystem: setting === 'system'}),
    );
  } catch {
    // Storage can be blocked (private windows). The theme still applies for this page.
  }
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Pick up class changes made by the inline script (ClientRouter swaps, system changes)
  // and choices made in another tab.
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    observer.disconnect();
    window.removeEventListener('storage', listener);
  };
}

/** The theme that is showing. Use this to theme things like CodeMirror. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getAppliedTheme, () => 'light');
}

/** The user's choice, plus a setter. Used by ThemePicker. */
export function useThemeSetting(): [ThemeSetting, (s: ThemeSetting) => void] {
  const setting = useSyncExternalStore(
    subscribe,
    getThemeSetting,
    (): ThemeSetting => 'system',
  );
  const set = useCallback((s: ThemeSetting) => setThemeSetting(s), []);
  return [setting, set];
}
