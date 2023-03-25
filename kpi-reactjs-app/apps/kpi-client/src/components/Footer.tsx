import * as React from 'react';
import styled from 'styled-components';
import { Container } from './Container';
import { Link } from './Link';
import { useTranslation } from 'react-i18next';

interface FooterProps {
  className?: string;
}

const Logo = styled.div`
  display: flex;
  align-items: center;
`;
const Menu = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0;

  a {
    margin-right: 1rem;
    padding: 0;
    font-size: 1rem;
    font-weight: 400;
    color: #a9a7bc;
    transition: color 0.3s ease;
  }
`;
const Copyright = styled.div`
  margin: 0;
  padding: 0 1rem 0 1.25rem;
  font-size: 1rem;
  font-weight: 400;
  color: #6f7286;
`;

const _Footer = (props: FooterProps) => {
  const { className } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Container>
        <Logo>
          <Copyright>2019 © ADFD</Copyright>
        </Logo>
        <Menu>
          <Link>{t('Terms of Use')}</Link>
          <Link>{t('Team')}</Link>
          <Link>{t('Contact')}</Link>
        </Menu>
      </Container>
    </div>
  );
};

export const Footer = styled(_Footer)`
  display: block;
  background-color: #1e1e2d;
  margin-top: 30px;
  padding: 2rem 0;

  ${Container} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
