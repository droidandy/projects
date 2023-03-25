import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { CatalogLayout } from 'layouts';
import { getSsrStore } from 'store';
import { PagePropsBase } from 'types/PagePropsBase';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { Meta } from 'components';
import { OsagoContainer } from 'containers/OsagoContainer';

interface Props extends PagePropsBase {}
const title = 'Оформите страховку';

const OsagoRoot: FC = () => {
  return (
    <>
      <Meta title={title} />
      <CatalogLayout>
        <OsagoContainer />
      </CatalogLayout>
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

export default memo(OsagoRoot);
