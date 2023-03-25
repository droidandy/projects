import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSsrStore } from 'store';
import { LandingPageLayout } from 'layouts';
import { IntegrationContainer } from 'containers/IntegrationContainer';
import { Meta } from 'components';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

const Integration: FC = memo(() => {
  return (
    <>
      <Meta
        title={'РГС БАНК | Объединение РГС Банка и банка Открытие. Вместе – к одной цели'}
        description={
          'Обращение Президента — Председателя Правления РГС Банка Алексея Токарева. Объединение РГС Банка и банка Открытие.'
        }
      />
      <LandingPageLayout>
        <IntegrationContainer />
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

export default Integration;
