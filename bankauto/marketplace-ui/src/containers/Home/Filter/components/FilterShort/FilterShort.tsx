import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Form, FormSpy } from 'react-final-form';
import { SelectOption } from '@marketplace/ui-kit/components/Select';
import { Node } from '@marketplace/ui-kit/types';
import { FormState } from 'final-form';
import { Button, Grid, Typography } from '@marketplace/ui-kit';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { SelectNew as Select, InputPrice } from 'components/Fields';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { convertFormToFilterValues, convertFilterToFormValues } from 'helpers/mappers';
import { analyticsFilterConfirm, analyticsBrandOnChange } from 'helpers/analytics/events';

export const mapFilterData = (i: Node): SelectOption => ({ label: i.name, value: i.id });

interface Props {
  carsCount: number;
  linkHref: { pathname: string; query: string };
  linkAs: { pathname: string; query: string };
  onChange: (values: VehiclesFilterValues) => void;
}

const FilterShort: FC<Props> = ({ linkHref, linkAs, carsCount, onChange }) => {
  const router = useRouter();

  const {
    values: stateValues,
    data: { brands, models, priceFrom, priceTo },
  } = useVehiclesFilter();

  const handleChange = ({ values }: FormState<VehiclesFilterValues>) => {
    onChange(convertFormToFilterValues(values, ['brands', 'models']));
  };

  const handleSubmit = () => {
    router.push(linkHref, linkAs);
    analyticsFilterConfirm();
  };
  const placeholderFrom = () => (
    <span>
      Цена от <br />
      {`${stateValues.priceFrom ? '' : `${priceFrom.toLocaleString('ru-RU')} ₽`}`}
    </span>
  );
  const placeholderTo = () => (
    <span>
      Цена до <br />
      {`${stateValues.priceTo ? '' : `${priceTo.toLocaleString('ru-RU')} ₽`}`}
    </span>
  );

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
                  variant="outlined"
                  name="brands"
                  placeholder="Марка"
                  options={brands.map(mapFilterData)}
                  onChange={analyticsBrandOnChange}
                />
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
                    <InputPrice
                      variant="outlined"
                      key="priceFrom"
                      area="priceFrom"
                      placeholder={placeholderFrom()}
                      name="priceFrom"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputPrice
                      variant="outlined"
                      key="priceTo"
                      area="priceTo"
                      placeholder={placeholderTo()}
                      name="priceTo"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Button fullWidth variant="contained" size="large" color="primary" onClick={handleSubmit}>
                  <Typography variant="h5" component="div">
                    Показать {carsCount.toLocaleString('fr')} авто
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

export { FilterShort };
