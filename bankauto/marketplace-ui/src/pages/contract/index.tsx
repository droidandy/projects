import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { getSsrStore } from 'store';
import { CatalogLayout } from 'layouts';
import { ContractContainer } from 'containers/Contract';
import { Meta } from 'components';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

const ContractRoot: FC = () => {
  const { isMobile } = useBreakpoints();
  return (
    <>
      <Meta />
      <CatalogLayout>
        <ContainerWrapper py={isMobile ? 5 : 10}>
          <ContractContainer />
        </ContainerWrapper>
      </CatalogLayout>
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

const Contract = memo(ContractRoot);

export default Contract;
