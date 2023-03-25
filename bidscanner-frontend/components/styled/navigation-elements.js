import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import styled from 'styled-components';

const MyNavbar = styled(Navbar)`
  background-color: white;
  border-radius: 0px;
  border-bottom: 1px solid black;
`;

const Brandname = styled.span`
  color: black;
  font-weight: bold;
`;

const MyNavbarBrand = styled(NavbarBrand)``;

const MyNav = styled(Nav)``;
const MyNavItem = styled(NavItem)`
  margin-right: 2em;
`;

export {
  MyNavbar as Navbar,
  Brandname as NavbarBrandname,
  MyNavbarBrand as NavbarBrand,
  MyNav as Nav,
  MyNavItem as NavItem,
};
