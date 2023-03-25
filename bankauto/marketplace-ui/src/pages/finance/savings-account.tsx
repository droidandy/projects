import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { SavingsAccount } from 'containers/Finance';
import { getSsrStore } from 'store';
import { fetchLinks } from 'store/links';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { getSavingsAccountRates } from 'api/savingsAccount';
import { SavingsAccountRate } from 'containers/Finance/SavingsAccount/types';
import { getPageInfo } from 'api/finance';
import { mapPageInfo } from 'containers/Finance/mappers/mapPageInfo';
import { PageInfo } from 'containers/Finance/types/PageInfo';

const SavingsAccountPage = ({ pageInfo, rates }: { pageInfo: PageInfo; rates: SavingsAccountRate[] }) => (
  <SavingsAccount pageInfo={pageInfo} rates={rates} />
);

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  await dispatch(fetchLinks({ path: '/finance/savings-account/' }));
  const { city } = store.getState();
  const { links } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  let pageInfo = {};
  try {
    const pageInfoDTO = await getPageInfo('/finance/savings-account/');
    if (pageInfoDTO?.data?.length) {
      [pageInfo] = mapPageInfo(pageInfoDTO.data);
    }
  } catch (err) {
    console.error(err);
  }

  try {
    const rates = await getSavingsAccountRates();
    return {
      props: {
        pageInfo,
        rates: rates?.data || [],
        context: getPageContextValues({ context }),
        initialState: {
          links,
          city,
        },
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        pageInfo,
        rates: [],
        context: getPageContextValues({ context }),
        initialState: {
          links,
          city,
        },
      },
    };
  }
};

export default SavingsAccountPage;
