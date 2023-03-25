import React, { FC, useMemo } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import { FormState } from 'final-form';
import { SelectOption } from '@marketplace/ui-kit/components/Select';
import { Node, VEHICLE_TYPE, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { makeStyles } from '@material-ui/styles';
import { ColorPicker, Grid, Box } from '@marketplace/ui-kit';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { AutocompleteNew as Autocomplete, InputNumber, SelectNew as Select } from 'components/Fields';
import { convertFilterToFormValues, convertFormToFilterValues } from 'helpers/mappers';
import { VehicleTypeRadio } from '../VehicleTypeRadio';
import { useYearsRange, usePowerRange, useVolumeRange } from '../../hooks';

export const mapFilterData = (i: Node): SelectOption => ({ label: i.name, value: i.id });

interface Props {
  onChange: (values: VehiclesFilterValues) => void;
}

const useStyles = makeStyles(() => ({
  colors: {
    padding: '1.25rem 0',
  },
}));

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

export const FilterFull: FC<Props> = ({ onChange }) => {
  const s = useStyles();
  const {
    values: stateValues,
    data: {
      brands,
      models,
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
      colors,
      installmentPayments,
    },
  } = useInstalmentFilter();
  const yearsRange = useYearsRange(yearFrom, yearTo);
  const powerRange = usePowerRange(powerFrom, powerTo);
  const volumeRange = useVolumeRange(volumeFrom, volumeTo);
  // refactor
  const months = useMemo(
    () =>
      Object.keys(installmentPayments).map((numberOfMonths) => ({
        label: `${numberOfMonths} месяцев`,
        value: numberOfMonths,
      })),
    [installmentPayments],
  );

  const handleChange = ({ values }: FormState<VehiclesFilterValues>) => {
    onChange(convertFormToFilterValues(values, ['brands', 'models']));
  };

  return (
    <Form
      onSubmit={() => {}}
      initialValues={convertFilterToFormValues(stateValues, [], ['brands', 'models'])}
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
              <Grid item>
                <Select name="brands" placeholder="Марка" options={brands.map(mapFilterData)} />
              </Grid>
              <Grid item>
                <Select
                  name="models"
                  placeholder="Модель"
                  options={models.map(mapFilterData)}
                  disabled={!stateValues.brands?.length}
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
                <Select name="installmentMonths" placeholder="Срок рассрочки" options={months} />
              </Grid>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InputNumber name="installmentMonthlyPaymentFrom" placeholder="Платеж от" suffix=" ₽/месяц" />
                  </Grid>
                  <Grid item xs={6}>
                    <InputNumber name="installmentMonthlyPaymentTo" placeholder="Платеж до" suffix=" ₽/месяц" />
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
                  {({ input: { value, onChange } }) => (
                    <ColorPicker
                      key="colors"
                      colors={colors}
                      selectedInitial={value}
                      onChange={onChange}
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
