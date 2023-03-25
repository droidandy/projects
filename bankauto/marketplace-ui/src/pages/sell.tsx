import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { PagePropsBase } from 'types/PagePropsBase';
import { HomeTab } from 'types/Home';
import { getSsrStore } from 'store';
import { LandingPageLayout } from 'layouts';
import { FavoritesLoader } from 'containers/Favorites';
import { HeroNew, MetaContainer, SellHomePageContent } from 'containers/Home';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

const SellHomePage: FC = () => {
  if (typeof window !== 'object') {
    return null;
  }
  return (
    <LandingPageLayout>
      <FavoritesLoader />
      <MetaContainer />
      <HeroNew />
      <SellHomePageContent />
    </LandingPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<PagePropsBase> = async (
  context: GetServerSidePropsContext<any>,
) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  const { home, vehicleCreate } = store.getState();

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: {
        vehicleCreate,
        city,
        home: { ...home, activeTab: HomeTab.SELL },
      },
    },
  };
};

export default memo(SellHomePage);
