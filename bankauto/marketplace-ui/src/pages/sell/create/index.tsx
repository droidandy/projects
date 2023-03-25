import React, { FC, memo, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { ContainerWrapper, Divider } from '@marketplace/ui-kit';
import { getSsrStore } from 'store/ssr';
import { useVehicleCreateValues } from 'store/catalog/create/values';
import { CatalogLayout } from 'layouts/CatalogLayout';
import { Meta } from 'components/Meta';
import { SeoNoIndexSetter } from 'components/SeoNoIndexSetter';
import { FormVehicleCreate } from 'containers/Sell/Form/Create';
import { FormVehicleProvider } from 'containers/VehicleCreate/FormContext';
import { SellCreateHero } from 'containers/Sell/Hero/SellCreateHero';
import { AuthenticationContainerC2C } from 'containers/AuthenticationContainerC2C';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    container: {
      paddingTop: '2.5rem',
      paddingBottom: '5rem',
      [down('xs')]: {
        paddingTop: '1.25rem',
        paddingBottom: '2.5rem',
      },
    },
    divider: {
      margin: '2.5rem 0',
      [down('xs')]: {
        margin: '1.25rem 0',
      },
    },
  }),
  { name: 'SellCreatePage' },
);

const title = 'Продать автомобиль';

const SellCreate: FC = () => {
  const classes = useStyles();
  const { clearVehicleCreateValues } = useVehicleCreateValues();

  useEffect(
    () => () => {
      clearVehicleCreateValues();
    },
    [clearVehicleCreateValues],
  );

  return (
    <CatalogLayout>
      <Meta title={title} />
      <SeoNoIndexSetter />
      <AuthenticationContainerC2C />
      <ContainerWrapper className={classes.container}>
        <SellCreateHero />
        <Divider className={classes.divider} />
        <FormVehicleProvider value={{}}>
          <FormVehicleCreate />
        </FormVehicleProvider>
      </ContainerWrapper>
    </CatalogLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return { props: { context: getPageContextValues({ context }), initialState: { city } } };
};

export default memo(SellCreate);
