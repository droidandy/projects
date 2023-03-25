import styled from 'styled-components';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import { Flex, Box } from 'grid-styled';

import GeneralTermsAndConditions from 'components/terms-of-use/TermsOfUse/GeneralTermsAndConditions';
import PrivacyPolicy from 'components/terms-of-use/TermsOfUse/PrivacyPolicy';
import DataSecurity from 'components/terms-of-use/TermsOfUse/DataSecurity';
import Cookies from 'components/terms-of-use/TermsOfUse/Cookies';

const Side = styled(Flex)`
  padding-top: 20px;
  padding-left: 20px;

  @media (min-width: 1024px) {
    position: fixed;
    background-color: white;
    height: 80vh;
    padding-top: 30vh;
    border-right: 1px solid #bcbec0;
  }
`;

const Main = styled(Box)`
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;

  @media (min-width: 1024px) {
    margin-left: 35%;
  }
`;

const Anchor = styled(Box)`
  font-size: 18px;
  font-weight: bold;
`;

const A = styled.a`
  color: black;
  & :hover {
    color: black;
    text-decoration: none;
  }
`;

export default () => (
  <Layout title="Terms of Use and Policies" showSearch>
    <Container>
      <Box>
        <Side pl={2} pr={4}>
          <Box>
            <Anchor>
              <A href="#terms-and-conditions">Terms and Conditions</A>
            </Anchor>
            <Anchor mt={2}>
              <A href="#privacy-policy">Privacy Policy</A>
            </Anchor>
            <Anchor mt={2}>
              <A href="#data-security">Data security</A>
            </Anchor>
            <Anchor mt={2}>
              <A href="#cookies">Cookies</A>
            </Anchor>
          </Box>
        </Side>
        <Main>
          <GeneralTermsAndConditions />
          <PrivacyPolicy />
          <DataSecurity />
          <Cookies />
        </Main>
      </Box>
    </Container>
  </Layout>
);
