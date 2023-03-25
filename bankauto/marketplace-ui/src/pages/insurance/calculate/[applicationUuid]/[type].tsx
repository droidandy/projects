import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { PagePropsBase } from 'types/PagePropsBase';
import { getSsrStore } from 'store';
import { MainLayout } from 'layouts/MainLayout';
import InsuranceContainer from 'containers/InsuranceContainer';
import { useRouteGuards } from 'hooks';
import { unauthorizedGuard } from 'guards';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

interface Props extends PagePropsBase {}

const InsuranceCalculate: FC = () => {
  useRouteGuards(unauthorizedGuard);
  const { query } = useRouter();
  const applicationUuid = query.applicationUuid ? (query.applicationUuid as string) : undefined;
  return (
    <MainLayout>
      <InsuranceContainer applicationUuid={applicationUuid} />
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  const props = { context: getPageContextValues({ context }), initialState: { city } };

  if (!issetCurrentCity) {
    return { props, notFound: true };
  }

  return {
    props,
  };
};

export default memo(InsuranceCalculate);
