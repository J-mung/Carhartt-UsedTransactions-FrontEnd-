import { useCallback, useState } from 'react';
import { sessionStore } from './sessionStorageHelper';

export function useSessionStore(key, initialValue = null) {
  const [value, setValueState] = useState(() => {
    const storedValue = sessionStore.get(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  const setValue = useCallback(
    (newValue) => {
      setValueState(newValue);
      sessionStore.set(key, newValue);
    },
    [key]
  );

  const remove = useCallback(() => {
    setValueState(null);
    sessionStore.remove(key);
  }, [key]);

  return { value, setValue, remove };
}
