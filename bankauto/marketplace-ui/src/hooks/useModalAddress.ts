import { useEffect } from 'react';
import { Noop } from 'helpers/noop';

export interface Props {
  opened: boolean;
  onClose: Noop;
}

export function useModalAddress({ opened, onClose }: Props) {
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '') onClose();
    };
    window.addEventListener('hashchange', onHashChange, false);
    return () => window.removeEventListener('hashchange', onHashChange, false);
  }, []);

  useEffect(() => {
    window.location.hash = opened ? 'modal' : '';
  }, [opened]);
}
