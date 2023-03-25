import React, { FC, memo, useCallback } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, ContainerWrapper, Divider, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { getSsrStore } from 'store';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { CatalogLayout } from 'layouts/CatalogLayout';
import { Meta } from 'components/Meta';
import { SeoNoIndexSetter } from 'components/SeoNoIndexSetter';
import { unauthorizedGuard } from 'guards';
import { StateModel } from 'store/types';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ReviewCreate as ReviewCreateModule } from '@marketplace/ui-modules';
import { BFF_URL, CATALOG_URL } from 'env-config';

export const useStyles = makeStyles(
  ({ breakpoints: { down } }) => ({
    container: {
      paddingTop: '2.5rem',
      paddingBottom: '2.5rem',
      [down('xs')]: {
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
      },
    },
    divider: {
      margin: '2.5rem 0',
      [down('xs')]: {
        margin: '1.25rem 0',
      },
    },
  }),
  { name: 'CreateReviewPage' },
);

const title = 'Отзыв об автомобиле';

const ReviewCreate: FC = () => {
  const router = useRouter();
  const { isLogout, isAuthorized } = useSelector((state: StateModel) => state.user);
  React.useEffect(() => {
    if (!isAuthorized && router.pathname.includes('profile') && !isLogout) {
      unauthorizedGuard();
    }
  }, [isAuthorized, router.pathname, isLogout]);

  const { isMobile } = useBreakpoints();
  const classes = useStyles();

  const getOfferUrl = useCallback(
    (brandAlias: string, modelAlias: string, offerId: number) => `/profile/${brandAlias}/${modelAlias}/${offerId}`,
    [],
  );

  if (!isAuthorized) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <CatalogLayout>
      <Meta title={title} />
      <SeoNoIndexSetter />
      <ContainerWrapper className={classes.container}>
        <Typography variant={isMobile ? 'h4' : 'h3'} component="h1">
          {title}
        </Typography>
        <Divider className={classes.divider} />
        <ReviewCreateModule
          token=""
          bffUrl={BFF_URL}
          push={router.push}
          pathname={router.pathname}
          query={new URLSearchParams(router.query as Record<string, string>).toString()}
          catalogUrl={CATALOG_URL}
          reviewListUrl={'/profile/reviews'}
          getOfferUrl={getOfferUrl}
        />
      </ContainerWrapper>
    </CatalogLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
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

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: { city },
    },
  };
};

export default memo(ReviewCreate);
