import React, { FC } from 'react';
import { MainLayout } from 'layouts';
import { PartnerNewContainer } from 'containers/PartnerNewContainer';

const PartnerNew: FC = () => {
  return (
    <MainLayout>
      <PartnerNewContainer />
    </MainLayout>
  );
};

export const getServerSideProps = async () => {
  return { props: {}, notFound: true };
};

export default PartnerNew;
