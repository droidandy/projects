import React, { FC, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Box, CircularProgress, ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { PagePropsBase } from 'types/PagePropsBase';
import { getSsrStore } from 'store';
import { StateModel } from 'store/types';
import { PersonalAreaLayout } from 'layouts';
import { Meta } from 'components';
import { unauthorizedGuard } from 'guards';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { useRouter } from 'next/router';
import { Reviews as ReviewsModule } from '@marketplace/ui-modules';
import { BFF_URL } from 'env-config';

interface Props extends PagePropsBase {}

const ReviewsRoot: FC = () => {
  const router = useRouter();
  const { isLogout, isAuthorized, firstName } = useSelector(
    (state: StateModel) => state.user,
    (l, r) => l.firstName === r.firstName && l.isAuthorized === r.isAuthorized,
  );
  React.useEffect(() => {
    if (!isAuthorized && router.pathname.includes('profile') && !isLogout) {
      unauthorizedGuard();
    }
  }, [isAuthorized, router.pathname, isLogout]);

  const { isMobile } = useBreakpoints();

  const getReviewUrl = useCallback((id: number) => `/profile/reviews/${id}`, []);
  const getReviewEditUrl = useCallback((id: number) => `/profile/reviews/${id}/edit`, []);

  const { push, pathname, query } = useRouter();

  return !isAuthorized || !firstName ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      <CircularProgress />
    </Box>
  ) : (
    <>
      <Meta />
      <PersonalAreaLayout>
        <ContainerWrapper pt={isMobile ? 2.5 : 3.75} pb={10}>
          <ReviewsModule
            bffUrl={BFF_URL}
            getReviewUrl={getReviewUrl}
            getEditReviewUrl={getReviewEditUrl}
            createNewReviewUrl="/profile/reviews/create"
            token=""
            push={push}
            pathname={pathname}
            query={new URLSearchParams(query as Record<string, string>).toString()}
          />
        </ContainerWrapper>
      </PersonalAreaLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
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
      context: getPageContextValues({ context, basePath: '/profile/reviews/' }),
      initialState: { city },
    },
  };
};

const Reviews = memo(ReviewsRoot);
export default Reviews;
