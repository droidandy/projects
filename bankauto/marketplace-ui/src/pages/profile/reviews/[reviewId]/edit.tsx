import React, { memo, useCallback } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ContainerWrapper, Divider, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { PersonalAreaLayout } from 'layouts';
import { getSsrStore } from 'store';
import { Meta, SeoNoIndexSetter } from 'components';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { makeStyles } from '@material-ui/core/styles';
import { ReviewEdit as ReviewEditModule } from '@marketplace/ui-modules';
import { BFF_URL, CATALOG_URL } from 'env-config';
import { useRouter } from 'next/router';

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
  { name: 'ReviewEditPage' },
);

const title = 'Редактировать отзыв об автомобиле';

export const ReviewEditRoot = () => {
  const { isMobile } = useBreakpoints();
  const classes = useStyles();

  const { push, query, pathname } = useRouter();

  const getReviewUrl = useCallback((id: number) => `/profile/reviews/${id}`, []);

  return (
    <>
      <Meta />
      <PersonalAreaLayout>
        <Meta title={title} />
        <SeoNoIndexSetter />
        <ContainerWrapper className={classes.container}>
          <Typography variant={isMobile ? 'h4' : 'h3'} component="h1">
            {title}
          </Typography>
          <Divider className={classes.divider} />
          <ReviewEditModule
            token=""
            bffUrl={BFF_URL}
            catalogUrl={CATALOG_URL}
            reviewId={Number(query.reviewId)}
            push={push}
            pathname={pathname}
            query={new URLSearchParams(query as Record<string, string>).toString()}
            getReviewUrl={getReviewUrl}
          />
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

  if (!isCurrentCitySet || !context.query.reviewId) {
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

const Review = memo(ReviewEditRoot);
export default Review;
