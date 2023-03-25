import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSsrStore } from 'store';
import { fetchLinks } from 'store/links';
import { fetchSpecialProgram, fetchVehiclesBySpecialProgram } from 'store/finance/specialProgram';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { SpecialPrograms } from 'containers/Finance/SpecialPrograms';

const SpecialProgramsPage = () => <SpecialPrograms />;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  await dispatch(fetchLinks({ path: `/finance/special-program/${context.query?.slug?.[0]}/` }));
  await dispatch(fetchSpecialProgram(context.query?.slug?.[0] as string));
  const { specialProgram } = store.getState();
  await dispatch(fetchVehiclesBySpecialProgram(specialProgram.data.id));

  const { links } = store.getState();

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: {
        links,
        city,
        specialProgram,
      },
    },
  };
};

export default SpecialProgramsPage;
