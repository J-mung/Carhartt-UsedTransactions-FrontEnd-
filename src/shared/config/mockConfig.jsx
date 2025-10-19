import { createContext, useContext, useMemo } from 'react';
import { IS_MOCK_CONFIG } from './env';

const MockConfigContext = createContext({
  isMockConfig: false,
});

const envMockSetting = IS_MOCK_CONFIG;
const initialIsMockConfig =
  envMockSetting === undefined || envMockSetting === ''
    ? true
    : envMockSetting.toString().toLowerCase() === 'true';

export function MockConfigProvider({ children } = {}) {
  const value = useMemo(
    () => ({
      isMockConfig: initialIsMockConfig,
    }),
    [initialIsMockConfig]
  );

  return (
    <MockConfigContext.Provider value={value}>
      {children}
    </MockConfigContext.Provider>
  );
}

export const useMockConfig = () => useContext(MockConfigContext);
