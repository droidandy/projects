import React, { FC, useEffect, useRef } from 'react';
import { setSravniWidget } from '../../helpers';
import { osagoConfig } from 'constants/sravniWidget';

const OsagoContainer: FC = () => {
  const sravniWidget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sravniWidget?.current) {
      setSravniWidget(osagoConfig);
    }
  }, [sravniWidget]);

  return <div ref={sravniWidget} id="sravniWidget" />;
};

export { OsagoContainer };
