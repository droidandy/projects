import React, { FC } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { FormState } from 'final-form';
import { Button, Grid } from '@marketplace/ui-kit';
import { InputNumber, SelectNew as Select } from 'components/Fields';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { AutocompleteOption } from 'components/Autocomplete';
import { convertFilterToFormValues, convertFormToFilterValues } from 'helpers/mappers';
import { InstalmentFilterProps } from './types';

type OptionMapper = {
  name: string;
  id: number | string;
};

const optionMapper = ({ name, id }: OptionMapper): AutocompleteOption => ({
  label: name,
  value: id,
});

const InstalmentMobileFilter: FC<InstalmentFilterProps> = ({
  onChange,
  placeholderFrom,
  placeholderTo,
  handleSubmit,
}) => {
  const { values: stateValues, data: formData } = useInstalmentFilter();

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
                <Select
                  name="brands"
                  placeholder="Марка"
                  variant="outlined"
                  options={formData.brands.map(optionMapper)}
                />
              </Grid>
              <Grid item>
                <Select
                  name="models"
                  placeholder="Модель"
                  variant="outlined"
                  options={formData.models.map(optionMapper)}
                  disabled={!stateValues.brands?.length}
                />
              </Grid>
              <Grid item>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <InputNumber
                      variant="outlined"
                      key="installmentMonthlyPaymentFrom"
                      area="installmentMonthlyPaymentFrom"
                      placeholder={placeholderFrom()}
                      name="installmentMonthlyPaymentFrom"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputNumber
                      variant="outlined"
                      key="installmentMonthlyPaymentTo"
                      area="installmentMonthlyPaymentTo"
                      placeholder={placeholderTo()}
                      name="installmentMonthlyPaymentTo"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button fullWidth variant="contained" size="large" color="primary" onClick={handleSubmit}>
                  Показать
                </Button>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Form>
  );
};

export { InstalmentMobileFilter };
