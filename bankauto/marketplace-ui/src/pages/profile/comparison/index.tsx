import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Box, CircularProgress, ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { getSsrStore } from 'store';
import { StateModel } from 'store/types';
import { PersonalAreaLayout } from 'layouts';
import { Meta } from 'components';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { unauthorizedGuard } from 'guards';
import { useRouter } from 'next/router';
import { Comparison as ComparisonModuleContainer } from '@marketplace/ui-modules';
import { BFF_URL } from 'env-config';

export const ComparisonRoot = () => {
  const router = useRouter();
  const { isLogout, isAuthorized } = useSelector((state: StateModel) => state.user);
  React.useEffect(() => {
    if (!isAuthorized && router.pathname.includes('profile') && !isLogout) {
      unauthorizedGuard();
    }
  }, [isAuthorized, router.pathname, isLogout]);

  const { isMobile } = useBreakpoints();

  return !isAuthorized ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      <CircularProgress />
    </Box>
  ) : (
    <>
      <Meta />
      <PersonalAreaLayout>
        <ContainerWrapper pt={isMobile ? 2.5 : 3.75} pb={10}>
          <ComparisonModuleContainer token="" bffUrl={BFF_URL} />
        </ContainerWrapper>
      </PersonalAreaLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const isCurrentCitySet = await checkAndSetCurrentCity(store, dispatch, context);

  const { city } = store.getState();

  if (!isCurrentCitySet) {
    return {
      props: {
        context: getPageContextValues({ context }),
        initialState: { city },
      },
      notFound: true,
    };
  }

  return {
    props: {
      context: getPageContextValues({ context, basePath: '/profile/review/' }),
      initialState: { city },
    },
  };
};

const Comparison = memo(ComparisonRoot);
export default Comparison;
