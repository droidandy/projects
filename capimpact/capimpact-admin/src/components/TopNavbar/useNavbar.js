import { useState } from 'react';

export default (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = () => setIsOpen(!isOpen);
  return {
    isOpen,
    toggle,
    setIsOpen,
  };
};
