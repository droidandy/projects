// @flow
import React, { type Children } from 'react';
import styled from 'styled-components';

import { Flex, Box } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import ServicesCarousel from 'components/general/ServicesCarousel';
import Subscription from 'components/subscription/Subscription';
import NestedList, { type NestedListProps } from 'components/general/NestedList';
import Escrow from './escrow.svg';
import Showcase from './showcase.svg';
import Certified from './certified.svg';
import RFQs from './rfqs.svg';

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const MenuItem = styled.span`
  color: black;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  text-align: left;
  margin-bottom: 16px;
  cursor: pointer;
  border-bottom: ${props => (props.active ? '2px solid #ff2929' : 'none')};
`;

const SectionWrapper = styled.div`margin-top: 5em;`;

export type LayoutProps = NestedListProps & {
  title: string,
  active: string,
  children: Children,
  faqs: Array<{
    title: string,
    text: string,
  }>,
};

export default (props: LayoutProps) => {
  const { title, active, children, faqs, description, keywords } = props;
  const leftFaqsList = faqs.slice(0, faqs.length / 2);
  const rightFaqsList = faqs.slice(faqs.length / 2);
  return (
    <Layout title={title} description={description} keywords={keywords}>
      <Container mt={3}>
        <Flex w={1} justify="space-between" align="flex-end">
          <Flex w={1 / 5} align="flex-end">
            <Showcase />
            <MenuItem href="/my/account" active={active === 'product-showcase'}>
              Product Showcase
            </MenuItem>
          </Flex>
          <Flex w={1 / 5} align="flex-end">
            <RFQs />
            <MenuItem href="/my/company" active={active === 'rfqs'}>
              RFQs
            </MenuItem>
          </Flex>
          <Flex w={1 / 5} align="flex-end">
            <Escrow />
            <MenuItem href="/my/network" active={active === 'escrow'}>
              Escrow
            </MenuItem>
          </Flex>
          <Flex w={1 / 5} align="flex-end" justify="flex-end">
            <Certified />
            <MenuItem href="/my/escrow" active={active === 'certified-company'}>
              Certified Company
            </MenuItem>
          </Flex>
        </Flex>
      </Container>
      <SectionWrapper>{children}</SectionWrapper>
      <Container>
        <SectionWrapper>
          <Flex direction="column">
            <Flex justify="center">
              <Title>FAQs</Title>
            </Flex>
            <Flex mt={2}>
              <Box w={1 / 2}>
                <NestedList items={leftFaqsList} />
              </Box>
              <Box w={1 / 2}>
                <NestedList items={rightFaqsList} />
              </Box>
            </Flex>
          </Flex>
        </SectionWrapper>
        <SectionWrapper>
          <Subscription />
        </SectionWrapper>
        <ServicesCarousel />
      </Container>
    </Layout>
  );
};
