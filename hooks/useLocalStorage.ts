"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      setLoaded(true);
    }
  }, [initialValue, key]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, loaded, value]);

  return [value, setValue, loaded] as const;
}
