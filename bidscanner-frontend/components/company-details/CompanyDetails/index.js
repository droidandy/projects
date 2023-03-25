// @flow
import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';
import NavigateBefore from 'material-ui/svg-icons/image/navigate-before';

import Container from 'components/styled/Container';
import Layout from 'components/Layout';

import Reference, { type ReferenceProps } from 'components/company-details/CompanyDetails/Reference';
import Certification, {
  type CertificationProps,
} from 'components/company-details/CompanyDetails/Certification';
import Document, { type DocumentProps } from 'components/company-details/CompanyDetails/Document';
import Carousel, { type CarouselProps } from 'components/general/Carousel';

import Shield from '../../svg/shield.svg';
import Approved from '../../svg/approved.svg';
import Payoneer from '../../svg/payoneer.svg';

const Title = styled.div`
  color: #bcbec0;
  font-size: 14px;
`;

const Header = styled(Flex)`height: 105px;`;

const CompanyName = styled.span`
  font-size: 26px;
  font-weight: bold;
`;

const SideInfo = styled.span`
  font-size: 12px;
  color: #bcbec0;
  margin-left: 20px;
`;

const Button = styled.button`
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #bcbec0;
  background-color: white;
`;

const Navigation = styled(Flex)`
  color: #bcbec0;
  font-size: 14px;
  cursor: pointer;
`;

const CarouselWrapper = styled(Box)`
  margin-left: 2em;
  margin-top: 2em;
  margin-right: 2em;
  @media (min-width: 1200px) {
    margin-left: 0;
  }
`;

type CompanyDetailsProps = {
  name: string,
  companyType: string,
  country: string,
  description: string,
  documents: DocumentProps[],
  logo: string,
  internalyVerified: boolean,
  externalyVerified: boolean,
  payoneerVerified: boolean,
  certifications: CertificationProps[],
  references: ReferenceProps[],
} & CarouselProps;

export default ({
  name,
  companyType,
  country,
  description,
  documents,
  logo,
  internalyVerified,
  externalyVerified,
  payoneerVerified,
  certifications,
  references,
  members,
}: CompanyDetailsProps) => (
  <Layout title="Company Profile" showSearch>
    <Container>
      <Navigation mt={1} align="center">
        <NavigateBefore style={{ color: '#BCBEC0', height: '12px', width: '12px' }} />Back To Search Result
      </Navigation>
      <Header align="center" mt={1}>
        <img src={logo} alt="company logo" />
        <Flex ml={3}>
          {internalyVerified && (
            <Box ml={2}>
              <Shield />
            </Box>
          )}
          {externalyVerified && (
            <Box ml={2}>
              <Approved />
            </Box>
          )}
          {payoneerVerified && (
            <Box ml={2}>
              <Payoneer />
            </Box>
          )}
        </Flex>
      </Header>
      <Box mt={3}>
        <CompanyName>{name}</CompanyName>
        <SideInfo>
          {country} ({companyType})
        </SideInfo>
        <SideInfo>128 followers</SideInfo>
      </Box>
      <Flex mt={1}>
        <Box>
          <Button>visit website</Button>
        </Box>
        <Box ml={2}>
          <Button>follow</Button>
        </Box>
      </Flex>
      <Box mt={3}>
        <Title>Business Description</Title>
        <Box w={3 / 4}>{description}</Box>
      </Box>
      <Box mt={3}>
        <Title>12 users work here</Title>
        <CarouselWrapper>
          <Carousel items={members} slidesToShow={8} />
        </CarouselWrapper>
      </Box>
      <Box mt={3}>
        <Title>Quality Certifications</Title>
        {certifications.map(({ name, expired }, index) => (
          <Certification name={name} expired={expired} key={`certification-${index}`} />
        ))}
      </Box>
      <Box mt={3}>
        <Title>Downloads</Title>
        {documents.map(({ name }, index) => <Document name={name} key={`document-${index}`} />)}
      </Box>
      <Box mt={3}>
        <Title>References</Title>
        {references.map(({ title, customer, year, amount, description }, index) => (
          <Reference
            title={title}
            customer={customer}
            year={year}
            amount={amount}
            description={description}
            key={`reference-${index}`}
          />
        ))}
      </Box>
    </Container>
  </Layout>
);
