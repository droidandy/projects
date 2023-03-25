import { Button, useBreakpoints, useDebounce } from '@marketplace/ui-kit';
import {
  MobileModalContainer,
  MobileModalContent,
  MobileModalDrawer,
  MobileModalFooter,
  MobileModalHeader,
} from 'components/MobileModalLayout';
import { makeStyles } from '@material-ui/styles';
import React, { memo, useState } from 'react';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import isEqual from 'lodash/isEqual';
import { FilterFull } from './components/FilterFull/FilterFull';
import FilterShort from './components/FilterShort/FilterShort';

const useStyles = makeStyles(() => ({
  fullFilterModal: {
    padding: '1.25rem',
  },
}));

export const FilterContainer = memo(() => {
  const s = useStyles();
  const [fullFilterOpened, setFullFilterOpened] = useState(false);
  const { isMobile } = useBreakpoints();
  const { values: stateValues, clearFilterValues, setInstalmentVehiclesFilterValues, initial } = useInstalmentFilter();
  const debouncedSetVehiclesFilterValues = useDebounce(setInstalmentVehiclesFilterValues, 200);

  const handleOpenFullFilter = () => {
    setFullFilterOpened(true);
  };

  const handleCloseFullFilter = () => {
    setFullFilterOpened(false);
  };

  const handleClearFilter = () => {
    clearFilterValues(stateValues.type!);
  };

  const handleChange = (values: VehiclesFilterValues) => {
    const valuesIsUpdated = !isEqual(values, stateValues);

    if (!valuesIsUpdated) {
      return;
    }

    if (!isEqual(stateValues.brands, values.brands) && (!initial || valuesIsUpdated)) {
      values.models = null;
      values.generations = null;
    }

    if (!isEqual(stateValues.models, values.models) && (!initial || valuesIsUpdated)) {
      values.generations = null;
    }
    debouncedSetVehiclesFilterValues(values);
  };

  return (
    <>
      {isMobile ? (
        <>
          <FilterShort onChange={handleChange} onAllParametersClick={handleOpenFullFilter} />
          <MobileModalDrawer open={fullFilterOpened} onClose={handleCloseFullFilter}>
            <MobileModalHeader
              showActionButton
              actionButtonLabel="Сбросить"
              onClose={handleCloseFullFilter}
              onClickActionButton={handleClearFilter}
            >
              Параметры
            </MobileModalHeader>
            <MobileModalContent>
              <MobileModalContainer>
                <div className={s.fullFilterModal}>
                  <FilterFull onChange={handleChange} />
                </div>
              </MobileModalContainer>
            </MobileModalContent>
            <MobileModalFooter>
              <Button fullWidth variant="contained" size="medium" onClick={handleCloseFullFilter} color="primary">
                Применить
              </Button>
            </MobileModalFooter>
          </MobileModalDrawer>
        </>
      ) : (
        <>
          <FilterFull onChange={handleChange} />
          <Button variant="outlined" color="primary" fullWidth onClick={handleClearFilter}>
            <b>Сбросить фильтр</b>
          </Button>
        </>
      )}
    </>
  );
});
