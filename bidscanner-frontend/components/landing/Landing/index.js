// @flow
import React from 'react';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import EnrollSection, { type EnrollSectionProps } from 'components/landing/Landing/EnrollSection';
import Description from 'components/landing/Landing/Description';
import Subscription from 'components/landing/Landing/Subscription';
import Services from 'components/landing/Landing/Services';

export type LandingProps = EnrollSectionProps;

export default () => (
  <Layout title="Landing Page" showServices>
    <EnrollSection />
    <Container>
      <Description />
      <Subscription />
      <Services />
    </Container>
  </Layout>
);
