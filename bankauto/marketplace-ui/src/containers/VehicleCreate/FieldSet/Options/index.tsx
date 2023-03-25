import React, { FC, memo, useEffect } from 'react';
import { useVehicleCreateOptions } from 'store/catalog/create/options';
import { useBreakpoints } from '@marketplace/ui-kit';
import { OptionsCollapse } from './OptionsCollapse';
import { OptionsDrawer } from './OptionsDrawer';

export const VehicleOptionsFieldSet: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  const {
    state: { options, initial },
    fetchVehicleCreateOptions,
  } = useVehicleCreateOptions();

  useEffect(() => {
    if (!initial) {
      fetchVehicleCreateOptions();
    }
  }, [fetchVehicleCreateOptions, initial]);

  return options.length ? (
    <>{!isMobile ? <OptionsCollapse options={options} /> : <OptionsDrawer options={options} />}</>
  ) : null;
});
