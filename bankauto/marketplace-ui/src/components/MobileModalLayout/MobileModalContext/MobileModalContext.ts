import { createContext, SyntheticEvent } from 'react';

interface ContextProperties {
  onClose: (event: SyntheticEvent) => void;
}

export default createContext<ContextProperties>({ onClose: () => {} });
