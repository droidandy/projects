import React, { useEffect, useRef } from 'react';
import { setSravniWidget } from 'helpers';
import { creditConfig } from 'constants/sravniWidget';

export const SravniRuWidget = () => {
  const sravniWidget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sravniWidget?.current) {
      setSravniWidget(creditConfig);
    }
  }, [sravniWidget]);
  return <div ref={sravniWidget} id="sravniWidget" />;
};
