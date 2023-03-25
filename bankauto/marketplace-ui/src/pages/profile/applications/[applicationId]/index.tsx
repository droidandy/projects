import React, { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Box, CircularProgress } from '@marketplace/ui-kit';
import { Application } from '@marketplace/ui-modules';
import { PagePropsBase } from 'types/PagePropsBase';
import { getSsrStore } from 'store';
import { StateModel } from 'store/types';
import { PersonalAreaLayout } from 'layouts';
import { Meta } from 'components';
import { useRouteGuards } from 'hooks';
import { unauthorizedGuard } from 'guards';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { BFF_URL } from 'env-config';

interface Props extends PagePropsBase {}

const ApplicationPageRoot: FC = () => {
  useRouteGuards(unauthorizedGuard);
  const user = useSelector((state: StateModel) => state.user);

  const { push, pathname, query } = useRouter();

  return !user.isAuthorized ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      <CircularProgress />
    </Box>
  ) : (
    <>
      <Meta />
      <PersonalAreaLayout>
        <Application
          push={push}
          pathname={pathname}
          query={new URLSearchParams(query as Record<string, string>).toString()}
          applicationUuid={query.applicationId as string}
          user={user}
          bffUrl={BFF_URL}
          token=""
        />
      </PersonalAreaLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return {
    props: {
      context: getPageContextValues({ context, basePath: '/profileNew/applications/' }),
      initialState: { city },
    },
  };
};

const ApplicationPage = memo(ApplicationPageRoot);

export default ApplicationPage;
