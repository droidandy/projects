import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSsrStore } from 'store';
import { PagePropsBase } from 'types/PagePropsBase';
import { MainLayout } from 'layouts/MainLayout';
import InsuranceContainer from 'containers/InsuranceContainer';
import { Meta } from 'components';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

interface Props extends PagePropsBase {}
const title = 'Оформите страховку';

const InsuranceCalculate: FC = () => {
  return (
    <>
      <Meta title={title} />
      <MainLayout>
        <InsuranceContainer />
      </MainLayout>
    </>
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
