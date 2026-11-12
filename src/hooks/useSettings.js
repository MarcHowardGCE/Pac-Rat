import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants.js';
import { readStored, writeStored } from '../utils/storage.js';

const PREFERENCES = {
  sound: STORAGE_KEYS.SOUND_ENABLED,
  music: 'pacRatMusic',
  effects: 'pacRatEffects',
  reducedMotion: 'pacRatReducedMotion',
  highContrast: 'pacRatHighContrast',
};

function readBoolean(key, fallback) {
  const stored = readStored(key);
  if (stored === 'true') return true;
  if (stored === 'false') return false;
  return fallback;
}

export function useSettings() {
  const [settings, setSettings] = useState(() => ({
    sound: readBoolean(PREFERENCES.sound, true),
    music: readBoolean(PREFERENCES.music, true),
    effects: readBoolean(PREFERENCES.effects, true),
    reducedMotion: readBoolean(PREFERENCES.reducedMotion, null),
    highContrast: readBoolean(PREFERENCES.highContrast, false),
  }));
  const [systemReducedMotion, setSystemReducedMotion] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReducedMotion(query.matches);
    query?.addEventListener?.('change', update);
    return () => query?.removeEventListener?.('change', update);
  }, []);

  const setPreference = useCallback((name, value) => {
    if (!Object.hasOwn(PREFERENCES, name)) return;
    writeStored(PREFERENCES[name], value);
    setSettings((current) => ({ ...current, [name]: value }));
  }, []);

  return { ...settings, reducedMotion: settings.reducedMotion ?? systemReducedMotion, setPreference };
}
