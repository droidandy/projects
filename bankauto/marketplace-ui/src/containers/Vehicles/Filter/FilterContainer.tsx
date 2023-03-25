/* eslint-disable no-param-reassign */
import React, { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import isEqual from 'lodash/isEqual';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { Button, useBreakpoints, useDebounce } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/styles';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import {
  MobileModalContainer,
  MobileModalContent,
  MobileModalDrawer,
  MobileModalFooter,
  MobileModalHeader,
} from 'components/MobileModalLayout';
import { getFromLocalStorage, setInLocalStorage } from 'helpers/localStorage';
import { FilterFull } from './components/FilterFull/FilterFull';
import FilterShort from './components/FilterShort/FilterShort';

const useStyles = makeStyles(() => ({
  fullFilterModal: {
    padding: '1.25rem',
  },
}));

export const FilterContainer = memo(() => {
  const router = useRouter();
  const { query } = router;
  const s = useStyles();
  const [fullFilterOpened, setFullFilterOpened] = useState(false);
  const { isMobile } = useBreakpoints();
  const { values: stateValues, initial, clearFilterValues, setVehiclesFilterValues } = useVehiclesFilter();
  const debouncedSetVehiclesFilterValues = useDebounce(setVehiclesFilterValues, 200);

  const handleOpenFullFilter = () => {
    setFullFilterOpened(true);
  };

  const handleCloseFullFilter = () => {
    setFullFilterOpened(false);
  };

  const handleClearFilter = () => {
    clearFilterValues(stateValues.type !== undefined && stateValues.type !== null ? stateValues.type : undefined);
  };

  const handleChange = (values: VehiclesFilterValues) => {
    const isAnyValueChanged = !isEqual(values, stateValues);
    if (!isAnyValueChanged) return;

    if (stateValues.withGift !== values.withGift) {
      setInLocalStorage('visitedWithGift', values.withGift);
    }

    if (
      !isEqual(stateValues.type, values.type) &&
      `${values.type}` === `${VEHICLE_TYPE_ID.USED}` &&
      (!initial || isAnyValueChanged)
    ) {
      values.specialOffers = null;
    }

    if (!isEqual(stateValues.specialOffers, values.specialOffers) && (!initial || isAnyValueChanged)) {
      values.brands = null;
      values.models = null;
      values.generations = null;
    }

    if (!isEqual(stateValues.brands, values.brands) && (!initial || isAnyValueChanged)) {
      values.models = null;
      values.generations = null;
    }

    if (!isEqual(stateValues.models, values.models) && (!initial || isAnyValueChanged)) {
      values.generations = null;
    }

    // TODO: fetch filter data only if relevant field has changed
    debouncedSetVehiclesFilterValues(values);
  };

  useEffect(() => {
    const LSValue = getFromLocalStorage<boolean>('visitedWithGift');
    if (query.withGift) {
      setVehiclesFilterValues({ ...stateValues, withGift: true }, false);
    } else if (LSValue !== null) {
      setVehiclesFilterValues({ ...stateValues, withGift: LSValue }, false);
    }
  }, []);

  useEffect(() => {
    if (query.withGift) setInLocalStorage('visitedWithGift', true);
  }, []);

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
