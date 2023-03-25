import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPageContextValues } from 'helpers/context/PageContext';
import { FinanceCredit } from 'containers/Finance';
import { getSsrStore } from 'store';
import { fetchLinks } from 'store/links';
import { checkAndSetCurrentCity } from 'helpers';
import { getPageInfo } from 'api/finance';
import { mapPageInfo } from 'containers/Finance/mappers/mapPageInfo';
import { PageInfo } from 'containers/Finance/types/PageInfo';

const FinanceCreditPage = ({ pageInfo }: { pageInfo: PageInfo }) => <FinanceCredit pageInfo={pageInfo} />;

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
    const pageInfoDTO = await getPageInfo('/finance/credit/');
    if (pageInfoDTO?.data?.length) {
      [pageInfo] = mapPageInfo(pageInfoDTO.data);
    }
  } catch (err) {
    console.error(err);
  }

  await dispatch(fetchLinks({ path: '/finance/credit/' }));

  const { links } = store.getState();

  return {
    props: {
      pageInfo,
      context: getPageContextValues({ context }),
      initialState: {
        links,
        city,
      },
    },
  };
};

export default FinanceCreditPage;
