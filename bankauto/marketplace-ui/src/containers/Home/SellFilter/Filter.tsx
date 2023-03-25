import React, { FC, memo, useCallback } from 'react';
import router from 'next/router';
import { Form } from 'react-final-form';
import { useBreakpoints } from '@marketplace/ui-kit';
import { useVehicleCreateValues } from 'store/catalog/create/values';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { getInitialValues } from 'containers/VehicleCreate/utils';
import { setFieldDataOptions } from 'helpers/formUtils';
import { FormSpyData } from 'containers/VehicleCreate/FormSpyData';
import { FilterDesktop } from './Desktop';
import { FilterMobile } from './Mobile';
import { useStyles } from './Filter.styles';

const SellFilterRoot: FC = () => {
  const { root } = useStyles();
  const { isMobile } = useBreakpoints();
  const { setVehicleCreateValues } = useVehicleCreateValues();
  const initialValues = getInitialValues();
  const handleContinue = useCallback(
    (values: VehicleFormSellValues) => {
      setVehicleCreateValues(values, true).then(() => {
        router.push('/sell/create/', '/sell/create/');
      });
    },
    [setVehicleCreateValues],
  );

  return (
    <Form onSubmit={handleContinue} initialValues={initialValues} mutators={{ setFieldDataOptions }} subscription={{}}>
      {({ handleSubmit }) => (
        <form name="home-sell-form" onSubmit={handleSubmit} className={root}>
          {isMobile ? <FilterMobile /> : <FilterDesktop />}
          <FormSpyData />
        </form>
      )}
    </Form>
  );
};

export const SellFilter = memo(SellFilterRoot);
