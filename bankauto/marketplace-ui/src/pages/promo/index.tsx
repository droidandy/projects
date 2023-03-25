import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSsrStore } from 'store';
import { LandingPageLayout } from 'layouts';
import { LandingContainer } from 'containers/Home';
import { Meta } from 'components';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

const Promo: FC = memo(() => {
  return (
    <>
      <Meta
        title={'Промокод на покупку техники на #банкавто'}
        description={'Получите промокод на покупку техники за регистрацию на #банкавто или за покупку авто.'}
      />
      <LandingPageLayout>
        <LandingContainer />
      </LandingPageLayout>
    </>
  );
});

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return {
      props: {
        context: getPageContextValues({ context }),
        initialState: { city },
      },
      notFound: true,
    };
  }

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: { city },
    },
  };
};

export default Promo;
