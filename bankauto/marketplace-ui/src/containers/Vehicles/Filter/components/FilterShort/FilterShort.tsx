import React, { FC, useEffect, useMemo, useState } from 'react';
import { FormState } from 'final-form';
import { Field, Form, FormSpy } from 'react-final-form';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { Button, Grid, Icon, Typography } from '@marketplace/ui-kit';
import { useRouter } from 'next/router';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { SelectNew as Select } from 'components/Fields';
import { ReactComponent as IconParams } from 'icons/iconFilterMore.svg';
import { convertFilterToFormValues, convertFormToFilterValues } from 'helpers/mappers';
import { GiftSwitch } from 'containers/Vehicles/Filter/components/GiftSwitch/GiftSwitch';
import { getFromLocalStorage } from 'helpers/localStorage';
import VehicleTypeSwitch from '../VehicleTypeSwitch/VehicleTypeSwitch';
import { getSellerType, mapFilterData } from '../FilterFull/FilterFull';
import { useYearsRange, useSellerTypeOptions } from '../../hooks';
import { useAllParamsButtonStyles, useStyles } from './FilterShort.styles';

interface Props {
  onAllParametersClick: () => void;
  onChange: (values: VehiclesFilterValues) => void;
}

const FilterShort: FC<Props> = ({ onChange, onAllParametersClick }) => {
  const s = useStyles();
  const buttonClasses = useAllParamsButtonStyles();
  const {
    values: stateValues,
    data: { specialOffers, sellerType, brands, models, yearFrom, yearTo },
  } = useVehiclesFilter();
  const yearsRange = useYearsRange(yearFrom, yearTo);
  const sellerTypeOptions = useSellerTypeOptions(sellerType);
  const { query } = useRouter();
  const [showGiftSwitch, setShowGiftSwitch] = useState(!!query.withGift);

  const activeFiltersCount = useMemo(
    () => Object.values(stateValues).filter((v) => (Array.isArray(v) ? v.length > 0 : v != null)).length - 1,
    [stateValues],
  );

  const handleChange = ({ values }: FormState<VehiclesFilterValues>) => {
    onChange(
      convertFormToFilterValues({ ...values, sellerType: getSellerType(values.sellerType, values.type) }, [
        'specialOffers',
        'brands',
        'models',
      ]),
    );
  };

  useEffect(() => {
    const LSValue = getFromLocalStorage<boolean>('visitedWithGift');
    if (!query.withGift && LSValue !== null) {
      setShowGiftSwitch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form
      onSubmit={() => {}}
      initialValues={convertFilterToFormValues(stateValues, [], ['specialOffers', 'brands', 'models'])}
      subscription={{}}
    >
      {() => {
        return (
          <>
            <FormSpy subscription={{ values: true }} onChange={handleChange} />
            <Grid container direction="column" spacing={1} wrap="nowrap">
              <Grid item>
                <Field name="type">
                  {({ input: { onChange: handleTypeChange } }) => (
                    <VehicleTypeSwitch light onChange={handleTypeChange} />
                  )}
                </Field>
              </Grid>
              {showGiftSwitch && (
                <Grid item>
                  <GiftSwitch />
                </Grid>
              )}
              {specialOffers?.length && stateValues.type !== VEHICLE_TYPE_ID.USED && (
                <Grid item>
                  <Select
                    variant="outlined"
                    name="specialOffers"
                    placeholder="Спецпрограмма"
                    options={specialOffers?.map(mapFilterData) || []}
                  />
                </Grid>
              )}
              {sellerTypeOptions && (
                <Grid item>
                  <Select variant="outlined" name="sellerType" placeholder="Продавец" options={sellerTypeOptions} />
                </Grid>
              )}
              <Grid item>
                <Select variant="outlined" name="brands" placeholder="Марка" options={brands.map(mapFilterData)} />
              </Grid>
              <Grid item>
                <Select
                  variant="outlined"
                  name="models"
                  placeholder="Модель"
                  options={models.map(mapFilterData)}
                  disabled={!stateValues.brands?.length}
                />
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Select variant="outlined" name="yearFrom" placeholder="Год от" options={yearsRange} />
                  </Grid>
                  <Grid item xs={6}>
                    <Select variant="outlined" name="yearTo" placeholder="Год до" options={yearsRange} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button
                  classes={buttonClasses}
                  fullWidth
                  startIcon={<Icon component={IconParams} viewBox="0 0 20 20" className={s.iconFilter} />}
                  endIcon={
                    <div className={s.activeFiltersBadge}>
                      <div>{activeFiltersCount}</div>
                    </div>
                  }
                  size="large"
                  variant="contained"
                  onClick={onAllParametersClick}
                >
                  <Typography variant="subtitle1" component="span" className={s.allParamsText}>
                    Все параметры
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Form>
  );
};

export default FilterShort;
