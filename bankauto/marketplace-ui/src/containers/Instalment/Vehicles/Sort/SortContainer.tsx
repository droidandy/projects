import React, { FC } from 'react';
import { Box, useBreakpoints, Icon } from '@marketplace/ui-kit';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { ReactComponent as SortIcon } from 'icons/iconSort.svg';
import { SortMenu } from './components';

export const SortContainer: FC = () => {
  const { sort, setSort } = useInstalmentFilter();
  const { isMobile } = useBreakpoints();

  const handleChange = (sortType: VehicleSortType) => {
    setSort({ sortType });
  };

  return (
    <Box display="flex" alignItems="center">
      {!isMobile && (
        <Box pr={0.5} maxHeight="1.25rem" overflow="hidden">
          <Icon component={SortIcon} viewBox="0 0 24 33" style={{ fontSize: '2rem' }} />
        </Box>
      )}
      <Box>
        <SortMenu activeItem={sort} handleChange={handleChange} />
      </Box>
    </Box>
  );
};
