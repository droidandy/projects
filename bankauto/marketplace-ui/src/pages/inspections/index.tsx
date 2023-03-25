import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useBreakpoints } from '@marketplace/ui-kit';
import { getSsrStore } from 'store';
import { LandingLayout } from 'layouts';
import { SeoNoIndexSetter } from 'components/SeoNoIndexSetter';
import { InspectionsInfo } from 'containers/Inspections/InspectionsInfo';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

const InspectionsInfoRoot: FC = () => {
  const { isMobile } = useBreakpoints();

  return (
    <LandingLayout withNavigation={!isMobile}>
      <SeoNoIndexSetter />
      <InspectionsInfo />
    </LandingLayout>
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

export default memo(InspectionsInfoRoot);
