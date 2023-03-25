import React, { FC } from 'react';
import { Box, useBreakpoints, Icon } from '@marketplace/ui-kit';
import { useRouter } from 'next/router';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { ReactComponent as SortIcon } from 'icons/iconSort.svg';
import { removePageParam } from 'helpers/getPagedUrl';
import { SortMenu } from './components';

export const SortContainer: FC = () => {
  const { push, asPath } = useRouter();
  const { sort, setSort } = useVehiclesFilter();
  const { isMobile } = useBreakpoints();

  const handleChange = (sortType: VehicleSortType) => {
    push('/car/[[...slug]]', removePageParam(asPath), { shallow: true });
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
