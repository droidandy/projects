import React, {
  createContext,
  ReactNode,
  useCallback,
  useState,
} from 'react';

export const PortalContext = createContext({
  gates: {},
  teleport: (gateName: string, element: JSX.Element) => {},
});

type PortalProviderProps = {
  children: ReactNode;
};

export const PortalProvider = ({ children }: PortalProviderProps): JSX.Element => {
  const [gates, setGates] = useState({});

  const teleport = useCallback((gateName: string, element: JSX.Element) => {
    setGates((prevGates) => ({ ...prevGates, [gateName]: element }));
  }, []);

  return (
    <PortalContext.Provider value={{ gates, teleport }}>
      {children}
    </PortalContext.Provider>
  );
};

type PortalGateProps = {
  gateName: string;
  children?: (teleport: (gateName: string, element: JSX.Element) => void) => JSX.Element;
};

export const PortalGate = ({ gateName, children }: PortalGateProps): JSX.Element => (
  <PortalContext.Consumer>
    {(value) => (
      <>
        {value.gates[gateName]}
        {children?.(value.teleport)}
      </>
    )}
  </PortalContext.Consumer>
);
