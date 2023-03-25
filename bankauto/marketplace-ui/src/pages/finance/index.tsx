import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { FinanceRoot } from 'containers/Finance';
import { PagePropsBase } from 'types/PagePropsBase';
import { getSsrStore } from 'store/ssr';
import { fetchPartners } from 'store/partners';
import { fetchBlogCategories, fetchBlogPosts } from 'store/blog';
import { fetchAdvertiseList } from 'store/finance/advertiseList';
import { fetchExchangeRates } from 'store/finance/exchangeRates';
import { fetchSpecialPrograms } from 'store/finance/specialPrograms';
import { MAIN_PAGE_REQUESTS_TIMEOUT } from 'api/request';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { getMainPageSections, getPageInfo } from 'api/finance';
import { mapMainPageSections } from 'containers/Finance/Root/mappers/mapMainPageSections';
import { MainPageSection } from 'containers/Finance/Root/types/MainPageSection';
import { PageInfo } from 'containers/Finance/types/PageInfo';
import { mapPageInfo } from 'containers/Finance/mappers/mapPageInfo';

const Finance = ({ mainPageSections, pageInfo }: { mainPageSections: MainPageSection[]; pageInfo: PageInfo }) => (
  <FinanceRoot mainPageSections={mainPageSections} pageInfo={pageInfo} />
);

export const getServerSideProps: GetServerSideProps<PagePropsBase> = async (
  context: GetServerSidePropsContext<any>,
) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return {
      props: {
        context: getPageContextValues({ context }),
        initialState: { city },
      },
      notFound: true,
    };
  }

  let pageInfo = {};
  try {
    const pageInfoDTO = await getPageInfo('/finance/');
    if (pageInfoDTO?.data?.length) {
      [pageInfo] = mapPageInfo(pageInfoDTO.data);
    }
  } catch (err) {
    console.error(err);
  }

  let mainPageSections: MainPageSection[] = [];
  const mainPageSectionsDTO = await getMainPageSections();

  if (mainPageSectionsDTO?.data?.length) {
    mainPageSections = mapMainPageSections(mainPageSectionsDTO.data);
  }
  await Promise.allSettled([
    dispatch(fetchBlogCategories()),
    dispatch(fetchBlogPosts({ timeout: MAIN_PAGE_REQUESTS_TIMEOUT }, { limit: 5, isMain: true })),
    dispatch(fetchAdvertiseList(4)),
    dispatch(fetchSpecialPrograms()),
    dispatch(fetchPartners()),
    dispatch(fetchExchangeRates()),
  ]);

  const { blog, advertiseList, specialPrograms, dealerPartners, exchangeRates } = store.getState();
  return {
    props: {
      pageInfo,
      mainPageSections,
      context: getPageContextValues({ context }),
      initialState: {
        blog,
        advertiseList,
        specialPrograms,
        dealerPartners,
        exchangeRates,
        city,
      },
    },
  };
};

export default Finance;
