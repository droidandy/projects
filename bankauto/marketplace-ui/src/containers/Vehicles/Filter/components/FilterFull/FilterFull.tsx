import React, { FC, useEffect, useMemo, useState } from 'react';
import { FormState } from 'final-form';
import { Field, Form, FormSpy } from 'react-final-form';
import { useRouter } from 'next/router';
import { Generation, NodeId, VEHICLE_TYPE, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { SelectOption } from '@marketplace/ui-kit/components/Select';
import { Box, ColorPicker, Grid } from '@marketplace/ui-kit';
import { VehicleTypeRadio } from 'containers/Vehicles/Filter/components/VehicleTypeRadio';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { SELLER_TYPE, VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { AutocompleteNew as Autocomplete, InputPrice, SelectNew as Select } from 'components/Fields';
import { convertFilterToFormValues, convertFormToFilterValues } from 'helpers/mappers';
import {
  useYearsRange,
  usePowerRange,
  useVolumeRange,
  useMileageRange,
  useSellerTypeOptions,
} from 'containers/Vehicles/Filter/hooks';
import { getFromLocalStorage } from 'helpers/localStorage';
import { GiftSwitch } from 'containers/Vehicles/Filter/components/GiftSwitch/GiftSwitch';
import { useStyles } from './FilterFull.styles';

export const mapFilterData = (i: NodeId): SelectOption => ({ label: i.name, value: i.id });

interface Props {
  onChange: (values: VehiclesFilterValues) => void;
}

const VEHICLE_TYPE_OPTIONS = [
  {
    label: 'Все',
    key: 'all',
    value: null,
  },
  {
    label: 'Новые',
    key: VEHICLE_TYPE.NEW,
    value: VEHICLE_TYPE_ID.NEW,
  },
  {
    label: 'C пробегом',
    key: VEHICLE_TYPE.USED,
    value: VEHICLE_TYPE_ID.USED,
  },
];

export const getSellerType = (sellerType: SELLER_TYPE | null, vehicleType?: VEHICLE_TYPE_ID | null) =>
  !vehicleType || +vehicleType !== VEHICLE_TYPE_ID.NEW ? sellerType : null;

export const FilterFull: FC<Props> = ({ onChange }) => {
  const s = useStyles();
  const {
    values: stateValues,
    data: {
      specialOffers,
      brands,
      models,
      generations: generationsRaw,
      bodyTypes,
      transmissions,
      engines,
      drives,
      yearFrom,
      yearTo,
      powerFrom,
      powerTo,
      volumeFrom,
      volumeTo,
      mileageFrom,
      mileageTo,
      colors,
      sellerType,
    },
  } = useVehiclesFilter();
  const yearsRange = useYearsRange(yearFrom, yearTo);
  const powerRange = usePowerRange(powerFrom, powerTo);
  const volumeRange = useVolumeRange(volumeFrom, volumeTo);
  const mileageRange = useMileageRange(mileageFrom, mileageTo);
  const sellerTypeOptions = useSellerTypeOptions(sellerType);
  const { query } = useRouter();
  const [showGiftSwitch, setShowGiftSwitch] = useState(!!query.withGift);

  const handleChange = ({ values }: FormState<VehiclesFilterValues>) => {
    onChange(
      convertFormToFilterValues({ ...values, sellerType: getSellerType(values.sellerType, values.type) }, [
        'specialOffers',
        'brands',
        'models',
        'generations',
      ]),
    );
  };

  const generations = useMemo(() => {
    return Object.values(
      generationsRaw.reduce((acc: { [key: string]: Generation }, item) => {
        if (!acc[`${item.alias}`]) {
          acc[`${item.alias}`] = item;
        }
        return acc;
      }, {}),
    );
  }, [generationsRaw]);

  useEffect(() => {
    const LSValue = getFromLocalStorage<boolean>('visitedWithGift');
    if (!query.withGift && LSValue !== null) {
      setShowGiftSwitch(true);
    }
  }, []);

  const type = stateValues.type as unknown as string | undefined | null; // TODO: make type number in store

  return (
    <Form
      onSubmit={() => {}}
      initialValues={convertFilterToFormValues(stateValues, [], ['specialOffers', 'brands', 'models', 'generations'])}
      subscription={{}}
    >
      {() => {
        return (
          <>
            <FormSpy subscription={{ values: true }} onChange={handleChange} />
            <Grid container direction="column" wrap="nowrap">
              <Grid item>
                <Box mb={2}>
                  <VehicleTypeRadio name="type" options={VEHICLE_TYPE_OPTIONS} />
                </Box>
              </Grid>
              {showGiftSwitch && (
                <Grid item>
                  <GiftSwitch />
                </Grid>
              )}
              {specialOffers?.length && type !== `${VEHICLE_TYPE_ID.USED}` && (
                <Grid item>
                  <Select
                    name="specialOffers"
                    placeholder="Спецпрограмма"
                    options={specialOffers?.map(mapFilterData) || []}
                  />
                </Grid>
              )}
              {sellerTypeOptions && (
                <Grid item>
                  <Select name="sellerType" placeholder="Продавец" options={sellerTypeOptions} />
                </Grid>
              )}
              <Grid item>
                <Select name="brands" placeholder="Марка" options={brands.map(mapFilterData)} />
              </Grid>
              <Grid item>
                <Select
                  name="models"
                  placeholder="Модель"
                  options={models.map(mapFilterData)}
                  disabled={!stateValues.brands?.length || !models.length}
                />
              </Grid>
              <Grid item>
                <Select
                  name="generations"
                  placeholder="Поколение"
                  options={(generations || []).map(mapFilterData)}
                  disabled={!stateValues.models?.length}
                />
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Select name="yearFrom" placeholder="Год от" options={yearsRange} />
                  </Grid>
                  <Grid item xs={6}>
                    <Select name="yearTo" placeholder="Год до" options={yearsRange} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InputPrice name="priceFrom" placeholder="Цена от" />
                  </Grid>
                  <Grid item xs={6}>
                    <InputPrice name="priceTo" placeholder="Цена до" />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Autocomplete name="bodyTypes" placeholder="Кузов" options={bodyTypes.map(mapFilterData)} multiple />
              </Grid>
              <Grid item>
                <Autocomplete
                  name="transmissions"
                  placeholder="Коробка передач"
                  options={transmissions.map(mapFilterData)}
                  multiple
                />
              </Grid>
              <Grid item>
                <Autocomplete name="engines" placeholder="Двигатель" options={engines.map(mapFilterData)} multiple />
              </Grid>
              <Grid item>
                <Autocomplete name="drives" placeholder="Привод" options={drives.map(mapFilterData)} multiple />
              </Grid>
              {stateValues.type && +stateValues.type === VEHICLE_TYPE_ID.USED ? (
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Select name="mileageFrom" placeholder="Пробег от" options={mileageRange} />
                    </Grid>
                    <Grid item xs={6}>
                      <Select name="mileageTo" placeholder="Пробег до" options={mileageRange} />
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Select name="powerFrom" placeholder="Мощность от" options={powerRange} />
                  </Grid>
                  <Grid item xs={6}>
                    <Select name="powerTo" placeholder="Мощность до" options={powerRange} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Select name="volumeFrom" placeholder="Объем от" options={volumeRange} />
                  </Grid>
                  <Grid item xs={6}>
                    <Select name="volumeTo" placeholder="Объем до" options={volumeRange} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Field name="colors">
                  {({ input: { value, onChange: handleColorsChange } }) => (
                    <ColorPicker
                      key="colors"
                      colors={colors}
                      selectedInitial={value}
                      onChange={handleColorsChange}
                      className={s.colors}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Form>
  );
};
