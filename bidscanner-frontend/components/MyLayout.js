// @flow
import React, { type Children } from 'react';
import styled from 'styled-components';

import { Flex } from 'grid-styled';
import Layout from 'components/Layout';
import Container from 'components/styled/Container';
import ButtonAsText from 'components/styled/ButtonAsText';

const TOC = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 300px;
  bottom: 84px;
  top: 86px;
  border-right: 1px solid #bcbec0;
  padding: 0 20px;
`;

const Content = styled.div`padding-left: 320px;`;

const MenuItem = styled.a`
  color: black;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  text-align: left;
  margin-bottom: 16px;
`;

const LogOutButton = styled(ButtonAsText)`
  color: #bcbec0;
  text-align: left;
`;

type Props = {
  title: string,
  active: string,
  children: Children,
};

export default (props: Props) => {
  const { title, active, children, description, keywords } = props;

  return (
    <Layout title={title} description={description} keywords={keywords}>
      <Container mt={3}>
        <TOC>
          <Flex flex="1 1 auto" column justify="center">
            <MenuItem href="/my/account" active={active === 'account'}>
              My Account
            </MenuItem>
            <MenuItem href="/my/company" active={active === 'company'}>
              My Company
            </MenuItem>
            <MenuItem href="/my/network" active={active === 'network'}>
              My Network
            </MenuItem>
            <MenuItem href="/my/escrow" active={active === 'escrow'}>
              Escrow Setup
            </MenuItem>
            <MenuItem href="/my/bills" active={active === 'bills'}>
              My Bills
            </MenuItem>
          </Flex>
          <Flex column mt={4}>
            <LogOutButton>Log Out</LogOutButton>
          </Flex>
        </TOC>
        <Content>{children}</Content>
      </Container>
    </Layout>
  );
};
