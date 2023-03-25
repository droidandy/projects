import React, { memo } from 'react';

import { EmailVerifyContainer } from 'containers/EmailVerifyContainer/EmailVerifyContainer';
import { Meta } from 'components';
import { MainLayout } from 'layouts';
import { getSsrStore } from '../store';
import { checkAndSetCurrentCity, getPageContextValues } from '../helpers';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

function EmailVerifyRoot(): JSX.Element {
  return (
    <>
      <Meta title="Подтверждение e-mail" description="Подтверждение e-mail" />
      <MainLayout>
        <EmailVerifyContainer />
      </MainLayout>
    </>
  );
}

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

const EmailVerify = memo(EmailVerifyRoot);

export default EmailVerify;
