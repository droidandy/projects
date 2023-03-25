import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSsrStore } from 'store';
import { checkAndSetCurrentCity, getPageContextValues, usePageContext } from 'helpers';
import { appStoreLink, playStoreLink } from 'constants/appLinks';
import { PagePropsBase } from 'types/PagePropsBase';

interface Props extends PagePropsBase {}

const AppPage: FC<Props> = () => {
  const { isiOS, isMobileDevice } = usePageContext();
  const { push } = useRouter();

  useEffect(() => {
    if (isMobileDevice) {
      if (isiOS) {
        push(appStoreLink);
      } else {
        push(playStoreLink);
      }
    } else {
      push('/');
    }
  }, [push, isiOS]);

  return null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const isCurrentCitySet = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!isCurrentCitySet) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return {
    props: {
      context: getPageContextValues({ context, basePath: '/app/' }),
      initialState: { city },
    },
  };
};

export default AppPage;
