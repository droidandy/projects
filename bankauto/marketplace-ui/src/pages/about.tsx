import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSsrStore } from 'store';
import { AboutContainer } from 'containers/AboutContainer';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return { props: { context: getPageContextValues({ context }), initialState: { city } } };
};

export default AboutContainer;
