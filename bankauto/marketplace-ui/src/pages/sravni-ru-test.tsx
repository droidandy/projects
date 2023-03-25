import React from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPageContextValues } from 'helpers';
import { SravniRuWidget } from 'containers/PersonalArea/components/SravniRuWidget';

const SravniRuTest = () => (
  <>
    <div>
      <SravniRuWidget />
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: {},
    },
  };
};

export default SravniRuTest;
