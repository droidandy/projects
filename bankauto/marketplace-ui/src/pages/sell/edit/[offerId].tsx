import React, { FC, memo } from 'react';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { makeStyles } from '@material-ui/core/styles';
import { ContainerWrapper, Divider } from '@marketplace/ui-kit';
import { useRouteGuards } from 'hooks';
import { unauthorizedGuard } from 'guards';
import { PagePropsBase } from 'types/PagePropsBase';
import { getSsrStore } from 'store';
import { PersonalAreaLayout } from 'layouts';
import { Meta } from 'components/Meta';
import { SeoNoIndexSetter } from 'components/SeoNoIndexSetter';
import { checkAndSetCurrentCity, getPageContextValues, usePageContext } from 'helpers';
import { SellCreateHero } from 'containers/Sell/Hero/SellCreateHero';
import { FormVehicleEdit } from 'containers/Sell/Form/Edit';
import { FormVehicleProvider } from 'containers/VehicleCreate/FormContext';
import { FormVehicleLoadOffer } from 'containers/VehicleCreate/VehicleLoad';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    container: {
      paddingTop: '2.5rem',
      paddingBottom: '2.5rem',
      [down('xs')]: {
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
      },
    },
    divider: { margin: '1.25rem 0' },
  }),
  { name: 'SellEditPage' },
);

interface QueryParams extends ParsedUrlQuery {
  offerId: string;
}

interface PageProps extends PagePropsBase<QueryParams> {}

const title = 'Редактирование объявления';

const FormContainer = memo(() => {
  return (
    <FormVehicleLoadOffer>
      <FormVehicleEdit />
    </FormVehicleLoadOffer>
  );
});

const PageSellEdit: FC = () => {
  useRouteGuards(unauthorizedGuard);
  const classes = useStyles();
  const {
    params: { offerId },
  } = usePageContext<QueryParams>();
  return (
    <PersonalAreaLayout>
      <Meta title={title} />
      <SeoNoIndexSetter />
      <ContainerWrapper className={classes.container}>
        <SellCreateHero />
        <Divider className={classes.divider} />
        <FormVehicleProvider value={{ catalogType: 'avito', id: offerId }}>
          <FormContainer />
        </FormVehicleProvider>
      </ContainerWrapper>
    </PersonalAreaLayout>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps, QueryParams> = async (context) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: { city },
    },
  };
};

export default PageSellEdit;
