import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FavoritesLoader } from 'containers/Favorites';
import { ComparisonLoader } from 'containers/PersonalArea/Comparison';
import { PagePropsBase } from 'types/PagePropsBase';
import { HomeTab } from 'types/Home';
import { getSsrStore } from 'store';
import { fetchBrandsAction } from 'store/catalog/brands';
import { LandingPageLayout } from 'layouts';
import { HeroNew, MetaContainer, HomeContent } from 'containers/Home';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

const VehiclesPage: FC = () => {
  return (
    <LandingPageLayout>
      <FavoritesLoader />
      <ComparisonLoader />
      <MetaContainer />
      <HeroNew />
      <HomeContent />
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

  await dispatch(fetchBrandsAction());

  const { home, brandsNew } = store.getState();

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: {
        home: { ...home, activeTab: HomeTab.INSURANCE },
        brandsNew,
        city,
      },
    },
  };
};

export default memo(VehiclesPage);
