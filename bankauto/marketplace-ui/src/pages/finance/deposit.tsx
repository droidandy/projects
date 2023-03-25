import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DepositOptions } from '@marketplace/ui-kit/types';
import { FinanceDeposit } from 'containers/Finance';
import { getSsrStore } from 'store';
import { fetchDepositRates } from 'store/finance/depositCalculator/actions';
import { fetchLinks } from 'store/links';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { getRatewithoutPercentWithdrawal } from 'containers/Finance/Deposit/helpers/getRatewithoutPercentWithdrawal';
import { getPageInfo } from 'api/finance';
import { mapPageInfo } from 'containers/Finance/mappers/mapPageInfo';
import { PageInfo } from 'containers/Finance/types/PageInfo';

const FinanceDepositPage = ({ pageInfo }: { pageInfo: PageInfo }) => <FinanceDeposit pageInfo={pageInfo} />;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  let pageInfo = {};
  try {
    const pageInfoDTO = await getPageInfo('/finance/deposit/');
    if (pageInfoDTO?.data?.length) {
      [pageInfo] = mapPageInfo(pageInfoDTO.data);
    }
  } catch (err) {
    console.error(err);
  }

  await dispatch(fetchDepositRates({ term: 12, options: DepositOptions.NoRefillNoWithdrawal, turnover: 50001 }));
  await dispatch(fetchLinks({ path: '/finance/deposit/' }));

  const { depositCalculator, links } = store.getState();
  const { term, depositRate } = depositCalculator;

  return {
    props: {
      pageInfo,
      context: getPageContextValues({ context }),
      maxRate: getRatewithoutPercentWithdrawal(depositRate, term).toFixed(2).replace('.', ','),
      initialState: {
        depositCalculator,
        links,
        city,
      },
    },
  };
};

export default FinanceDepositPage;
