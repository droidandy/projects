import React, { FC, memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { getSsrStore } from 'store';
import { StateModel } from 'store/types';
import { PersonalAreaLayout } from 'layouts';
import { LoaderProgress } from 'components/LoaderProgress';
import { Meta } from 'components';
import { InspectionsListContainer } from 'containers/PersonalArea/Inspections';
import { unauthorizedGuard } from 'guards';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

const InspectionsRoot: FC = () => {
  const { isAuthorized } = useSelector((state: StateModel) => state.user);

  useEffect(() => {
    unauthorizedGuard();
  }, []);

  return !isAuthorized ? (
    <LoaderProgress />
  ) : (
    <>
      <Meta />
      <PersonalAreaLayout>
        <ContainerWrapper pb={18.75} pt={3.75}>
          <InspectionsListContainer />
        </ContainerWrapper>
      </PersonalAreaLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return { props: { context: getPageContextValues({ context }), initialState: { city } } };
};

export default memo(InspectionsRoot);
