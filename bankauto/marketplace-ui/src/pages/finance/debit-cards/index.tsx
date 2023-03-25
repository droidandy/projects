import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPageContextValues } from 'helpers/context/PageContext';
import { FinanceDebitCards } from 'containers/Finance/DebitCards';
import { getSsrStore } from 'store';
import { fetchLinks } from 'store/links';
import { fetchDebitCards } from 'store/finance/debitCards';
import { getPageInfo } from 'api/finance';
import { mapPageInfo } from 'containers/Finance/mappers/mapPageInfo';
import { PageInfo } from 'containers/Finance/types/PageInfo';

const FinanceDebitCardsPage = ({ pageInfo }: { pageInfo: PageInfo }) => <FinanceDebitCards pageInfo={pageInfo} />;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const pageContext = getPageContextValues({ context });
  const store = getSsrStore();
  const { dispatch } = store;

  await Promise.allSettled([dispatch(fetchLinks({ path: '/finance/debit-cards/' })), dispatch(fetchDebitCards())]);

  const { links, debitCards } = store.getState();

  let pageInfo = {};
  try {
    const pageInfoDTO = await getPageInfo('/finance/debit-cards/');
    if (pageInfoDTO?.data?.length) {
      [pageInfo] = mapPageInfo(pageInfoDTO.data);
    }
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      pageInfo,
      context: pageContext,
      initialState: {
        links,
        debitCards,
      },
    },
  };
};

export default FinanceDebitCardsPage;
