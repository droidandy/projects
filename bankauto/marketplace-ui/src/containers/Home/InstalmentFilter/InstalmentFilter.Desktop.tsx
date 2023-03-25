import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { FormState } from 'final-form';
import { InputGroup } from '@marketplace/ui-kit';
import { InputPrice, SelectNew as Select } from 'components/Fields';
import { convertFilterToFormValues, convertFormToFilterValues } from 'helpers/mappers';
import { makeStyles } from '@material-ui/styles';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { FilterButton } from 'components';
import { AutocompleteOption } from 'components/Autocomplete';
import { InstalmentFilterProps } from './types';

const TEMPLATE = [['brands', 'models', 'installmentMonthlyPaymentFrom', 'installmentMonthlyPaymentTo']];
const useStyles = makeStyles(() => ({
  control: {
    height: '5rem',
  },
}));
interface InstalmentDesktopFilterProps extends InstalmentFilterProps {
  className?: string;
}

type OptionMapper = {
  name: string;
  id: number | string;
};
const optionMapper = ({ name, id }: OptionMapper): AutocompleteOption => ({
  label: name,
  value: id,
});

const InstalmentDesktopFilter = ({
  className,
  onChange,
  placeholderFrom,
  placeholderTo,
  handleSubmit,
}: InstalmentDesktopFilterProps) => {
  const { values: stateValues, data: formData } = useInstalmentFilter();

  const handleChange = ({ values }: FormState<VehiclesFilterValues>) => {
    onChange(convertFormToFilterValues(values, ['brands', 'models']));
  };
  const { control } = useStyles();
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
            <InputGroup className={className} templateAreas={TEMPLATE}>
              <Select
                className={control}
                name="brands"
                placeholder="Марка"
                variant="outlined"
                options={formData.brands.map(optionMapper)}
              />
              <Select
                className={control}
                name="models"
                placeholder="Модель"
                variant="outlined"
                options={formData.models.map(optionMapper)}
                disabled={!stateValues.brands?.length}
              />
              <InputPrice
                className={control}
                variant="outlined"
                key="installmentMonthlyPaymentFrom"
                area="installmentMonthlyPaymentFrom"
                placeholder={placeholderFrom()}
                name="installmentMonthlyPaymentFrom"
              />
              <InputPrice
                className={control}
                variant="outlined"
                key="installmentMonthlyPaymentTo"
                area="installmentMonthlyPaymentTo"
                placeholder={placeholderTo()}
                name="installmentMonthlyPaymentTo"
              />
            </InputGroup>
            <FilterButton link={['', '']} onSubmit={handleSubmit} />
          </>
        );
      }}
    </Form>
  );
};

export { InstalmentDesktopFilter };
