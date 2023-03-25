import React, { FC } from 'react';
import { InputGroup, useBreakpoints } from '@marketplace/ui-kit';
import { makeStyles } from '@material-ui/styles';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { Node, StyledProps } from '@marketplace/ui-kit/types';
import { SelectNew as Select, InputPrice } from 'components/Fields';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { Form, FormSpy } from 'react-final-form';
import { FormState } from 'final-form';
import { FilterButton } from 'components';
import { convertFormToFilterValues, convertFilterToFormValues } from 'helpers/mappers';
import { analyticsFilterConfirm, analyticsBrandOnChange } from 'helpers/analytics/events';

const MOBILE_FIELDS = [
  ['brands', 'brands'],
  ['models', 'models'],
  ['priceFrom', 'priceTo'],
];

const DESKTOP_FIELDS = [['brands', 'models', 'priceFrom', 'priceTo']];

const useStyles = makeStyles(() => ({
  control: {
    height: '5rem',
  },
}));

interface Props extends StyledProps {
  onChange: (values: VehiclesFilterValues) => void;
  linkHref: { pathname: string; query: string };
  linkAs: { pathname: string; query: string };
  className: string;
}

const mapFilterData = (i: Node) => ({ label: i.name, value: i.id });

const FilterFull: FC<Props> = ({ onChange, className, linkHref, linkAs }) => {
  const s = useStyles();
  const {
    values: stateValues,
    data: { brands, models, priceFrom, priceTo },
  } = useVehiclesFilter();
  const { isMobile } = useBreakpoints();

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
            <InputGroup className={className} templateAreas={isMobile ? MOBILE_FIELDS : DESKTOP_FIELDS}>
              <Select
                className={s.control}
                variant="outlined"
                area="brands"
                placeholder="Марка"
                name="brands"
                options={brands.map(mapFilterData)}
                onChange={analyticsBrandOnChange}
              />
              <Select
                className={s.control}
                variant="outlined"
                area="models"
                placeholder="Модель"
                name="models"
                options={models.map(mapFilterData)}
                disabled={!stateValues.brands?.length}
              />
              <InputPrice
                className={s.control}
                variant="outlined"
                area="priceFrom"
                placeholder={`Цена от ${stateValues.priceFrom ? '' : `${priceFrom.toLocaleString('ru-RU')} ₽`}`}
                name="priceFrom"
              />
              <InputPrice
                className={s.control}
                variant="outlined"
                area="priceTo"
                placeholder={`Цена до ${stateValues.priceTo ? '' : `${priceTo.toLocaleString('ru-RU')} ₽`}`}
                name="priceTo"
              />
            </InputGroup>
            <FilterButton
              link={[linkHref, linkAs]}
              onClick={() => {
                analyticsFilterConfirm();
              }}
            />
          </>
        );
      }}
    </Form>
  );
};

export { FilterFull };
