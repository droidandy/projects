import React, { FC, useMemo } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import { FormState } from 'final-form';
import { SelectOption } from '@marketplace/ui-kit/components/Select';
import { Node } from '@marketplace/ui-kit/types';
import { Button, Grid, Icon, Typography } from '@marketplace/ui-kit';
import { ReactComponent as IconParams } from '@marketplace/ui-kit/icons/icon-params.svg';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { SelectNew as Select } from 'components/Fields';
import { convertFilterToFormValues, convertFormToFilterValues } from 'helpers/mappers';
import VehicleTypeSwitch from '../VehicleTypeSwitch/VehicleTypeSwitch';
import { useYearsRange } from '../../hooks';
import { useAllParamsButtonStyles, useStyles } from './FilterShort.styles';

export const mapFilterData = (i: Node): SelectOption => ({ label: i.name, value: i.id });

interface Props {
  onAllParametersClick: () => void;
  onChange: (values: VehiclesFilterValues) => void;
}

const FilterShort: FC<Props> = ({ onChange, onAllParametersClick }) => {
  const s = useStyles();
  const buttonClasses = useAllParamsButtonStyles();
  const {
    values: stateValues,
    data: { brands, models, yearFrom, yearTo },
  } = useInstalmentFilter();
  const yearsRange = useYearsRange(yearFrom, yearTo);

  const activeFiltersCount = useMemo(
    () => Object.values(stateValues).filter((v) => (Array.isArray(v) ? v.length > 0 : v != null)).length - 1,
    [stateValues],
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
            <Grid container direction="column" spacing={1} wrap="nowrap">
              <Grid item>
                <Field name="type">
                  {({ input: { value, onChange } }) => <VehicleTypeSwitch light value={+value} onChange={onChange} />}
                </Field>
              </Grid>
              <Grid item>
                <Select
                  variant="outlined"
                  name="brands"
                  placeholder="Марка"
                  options={brands.map(mapFilterData)}
                  multiple
                />
              </Grid>
              <Grid item>
                <Select
                  variant="outlined"
                  name="models"
                  placeholder="Модель"
                  options={models.map(mapFilterData)}
                  multiple
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
                  startIcon={<Icon component={IconParams} viewBox="0 0 20 20" />}
                  endIcon={<div className={s.activeFiltersBadge}>{activeFiltersCount}</div>}
                  size="large"
                  variant="contained"
                  onClick={onAllParametersClick}
                >
                  <Typography variant="body1" component="span" className={s.allParamsText}>
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
