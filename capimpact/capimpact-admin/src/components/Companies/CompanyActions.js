import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Icon } from 'components/Icon';

const CompanyActions = ({ company }) => {
  const match = useRouteMatch();

  return (
    <div
      className="d-flex ml-2"
      style={{
        borderRadius: 9,
        border: '1px solid #dddddd',
        padding: '4px 8px',
      }}
    >
      <Link to={`/companies/${company.id}/view`} className="mx-1" title="View Company">
        <Icon image="ic-1" />
      </Link>
      <Link
        to={`/companies/${company.id}/partner-network`}
        className="mx-1"
        title="View Partner Network"
      >
        <Icon image="ic-2" />
      </Link>
      <UncontrolledDropdown>
        <DropdownToggle tag="a" style={{ cursor: 'pointer' }}>
          <Icon image="ic-3" />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem tag={Link} to={`${match.url}/clone/${company.id}`}>
            <Icon icon="fa-copy" className="mr-2" /> Clone
          </DropdownItem>
          <DropdownItem tag={Link} to={`${match.url}/update/${company.id}`}>
            <Icon icon="fa-edit" className="mr-2" /> Edit
          </DropdownItem>
          <DropdownItem tag={Link} to={`${match.url}/delete/${company.id}`}>
            <Icon icon="fa-trash" className="mr-2" /> Remove
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default CompanyActions;
