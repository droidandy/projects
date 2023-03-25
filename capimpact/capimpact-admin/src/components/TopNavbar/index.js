import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import AuthService from 'services/auth';

import useNavbar from './useNavbar';

const industryMenu = [
  {
    key: 'capabilities',
    title: 'CapTrees',
  },
  {
    key: 'valuedrivers',
    title: 'Value Drivers',
  },
  {
    key: 'processes',
    title: 'CapProcesses',
  },
  {
    key: 'startups',
    title: 'Start Ups',
  },
];

const TopNavbar = () => {
  const history = useHistory();
  const location = useLocation();
  const industryId = String(location.pathname).split('/')[2] || 1;
  const { isOpen, toggle } = useNavbar(false);

  const currentIndustryItem = industryMenu.find(it => location.pathname.startsWith(`/${it.key}`));
  //const user = AuthService.getUser();

  return (
    <Navbar color="light" expand="md" light>
      <NavbarBrand href="/">
        <img className="logo d-inline-block align-top" height="30" src="/logo.png" alt="" /> Admin
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        {AuthService.isAuthenticated() ? (
          <React.Fragment>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/">
                  <i className="fa fa-home" />
                </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {currentIndustryItem ? currentIndustryItem.title : 'Industries'}
                </DropdownToggle>
                <DropdownMenu right>
                  {industryMenu.map(item => (
                    <DropdownItem key={item.key} tag={Link} to={`/${item.key}/${industryId}`}>
                      {item.title}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink
                  tag={Link}
                  to={`/companies`}
                  active={location.pathname.startsWith('/companies')}
                >
                  Companies
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={Link}
                  to={`/globals`}
                  active={location.pathname.startsWith('/globals')}
                >
                  Globals
                </NavLink>
              </NavItem>
            </Nav>
            <Nav className="" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>
                  <i className="fa fa-user-circle" />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to="/">
                    Home
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag="a" onClick={() => AuthService.logout({ history })}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </React.Fragment>
        ) : null}
      </Collapse>
    </Navbar>
  );
};

export default TopNavbar;

/*location.pathname.startsWith('/companies') && (
                  <div className="d-flex align-items-center">
                    <div style={{ width: 200 }}>
                      <Select
                        options={industries.map(({ id, name }) => ({ label: name, value: id }))}
                        onChange={async value => {
                          history.push(`/companies/add/${value.value}`);
                        }}
                        theme={theme => ({
                          ...theme,
                          borderRadius: 0,
                          spacing: 1,
                        })}
                        placeholder="Industries"
                      />
                    </div>
                  </div>
                )*/

/*<NavItem>
                  <NavLink
                    tag={Link}
                    to={`/capabilities/${industryId}`}
                    active={location.pathname.startsWith('/capabilities')}
                  >
                    CapTrees
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to={`/processes/${industryId}`}
                    active={location.pathname.startsWith('/processes')}
                  >
                    CapProcesses
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    tag={Link}
                    to={`/startups/${industryId}`}
                    active={location.pathname.startsWith('/startups')}
                  >
                    Start Ups
                  </NavLink>
                </NavItem>*/
