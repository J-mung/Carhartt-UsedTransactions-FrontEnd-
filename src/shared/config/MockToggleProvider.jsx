import { createContext, useContext, useState } from 'react';

const MockConfigContext = createContext();

export function MockToggleProvider({ children }) {
  const [useMock, setUseMock] = useState(
    import.meta.env.VITE_USE_MOCK === 'true'
  );

  return (
    <MockConfigContext.Provider value={{ useMock, setUseMock }}>
      {children}
    </MockConfigContext.Provider>
  );
}

export const useMockToggle = () => useContext(MockConfigContext);
