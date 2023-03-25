import React, { useRef, useState } from 'react';
import { useLayoutEffect } from 'hooks/useLayoutEffectPoly';

export const AddressAutocompleteOption = ({ label }: any) => {
  const [width, setWidth] = useState<string>('auto');
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      const maxWidth = window.innerWidth - 40;
      const width = ref.current.getBoundingClientRect().width;

      if (width > maxWidth) {
        setWidth(`${maxWidth}px`);
      }
    }
  }, []);

  return (
    <div ref={ref} style={{ width: width, overflow: 'hidden', textOverflow: 'ellipsis', direction: 'rtl' }}>
      {label}
    </div>
  );
};
