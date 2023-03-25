import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPageContextValues } from 'helpers/context/PageContext';
import { FinanceDebitCard } from 'containers/Finance/DebitCards/DebitCard';
import { getSsrStore } from 'store';
import { fetchLinks } from 'store/links';
import { fetchDebitCard } from 'store/finance/debitCards';
import { DebitCardName } from 'store/types';

const FinanceDebitCardPage = () => <FinanceDebitCard />;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const pageContext = getPageContextValues({ context });
  const store = getSsrStore();
  const { dispatch } = store;
  await Promise.allSettled([
    dispatch(fetchLinks({ path: `/finance/debit-cards/${context.query?.debitCardName}/` })),
    dispatch(fetchDebitCard(context.query.debitCardName as DebitCardName)),
  ]);

  const {
    links,
    debitCards: { item },
  } = store.getState();

  return {
    props: {
      context: pageContext,
      initialState: {
        links,
        debitCards: {
          item,
        },
      },
    },
  };
};

export default FinanceDebitCardPage;
