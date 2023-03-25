import styled from 'styled-components';
import Link from 'next/link';
import Icon from '../svg/logo.svg';

const Text = styled.span`
  font-size: 24px;
  color: black;
  font-weight: 600;
  margin-left: 5px;
`;

const CompanyLogo = styled.div`
  & > a:hover {
    text-decoration: none;
    cursor: pointer;
  }
  & > a {
    text-decoration: none;
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
`;

export default () =>
  <CompanyLogo>
    <Link href="/general/home">
      <Logo>
        <Icon />
        <Text>tradekoo</Text>
      </Logo>
    </Link>
  </CompanyLogo>;
