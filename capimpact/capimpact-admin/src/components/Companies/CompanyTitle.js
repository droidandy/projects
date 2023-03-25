import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { Icon } from 'components/Icon';

import classes from './styles.module.scss';

const CompanyTitle = ({ company = {} }) => {
  const match = useRouteMatch();
  const action = match.url.split('/').pop();
  const industry = company && company.industry;

  return (
    <div className={classes.pageTitleWrapper}>
      <h2 className={classes.pageTitle}>
        <span className={classes.pageTitleText}>
          <span className={classes.pageTitleCompanyName}>{company.name}</span>
          <small className={classes.pageTitleSubtext}>
            {action === 'view' && 'Departments and Underlying Capabilities'}
            {action === 'edit' && 'Departments and Underlying Capabilities'}
            {action === 'partner-network' && 'Partner Network'}
          </small>
        </span>
        <div className="actions">
          {action === 'view' ? (
            <UncontrolledDropdown>
              <DropdownToggle tag="a" style={{ cursor: 'pointer' }}>
                <Icon image="ic-3" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem tag={Link} to={`/companies/${company.id}/edit/caps`}>
                  <Icon icon="fa-edit" className="mr-2" /> Update CapTree
                </DropdownItem>
                <DropdownItem tag={Link} to={`/companies/${company.id}/edit/lenses`}>
                  <Icon icon="fa-edit" className="mr-2" /> Edit Lenses
                </DropdownItem>
                <DropdownItem tag={Link} to={`/companies/${company.id}/edit/tags`}>
                  <Icon icon="fa-edit" className="mr-2" /> Edit Tags
                </DropdownItem>
                <DropdownItem tag={Link} to={`/companies/${company.id}/edit/filters`}>
                  <Icon icon="fa-edit" className="mr-2" /> Edit Filters
                </DropdownItem>
                <DropdownItem tag={Link} to={`/companies/${company.id}/edit/spend-fte`}>
                  <Icon icon="fa-edit" className="mr-2" /> Edit Spend/FTE
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ) : null}
        </div>
      </h2>
      {company.id && (
        <div className="d-flex align-items-center">
          <h5 className="text-muted m-0">
            <span style={{ marginRight: 10 }}>{`Cap CDS ID: ${company.cid};`}</span>
            <span>{`Industry: ${industry ? industry.name : ''}`}</span>
          </h5>
          <span style={{ marginLeft: 16 }}>
            <Link to={`/companies/${company.id}/view`}>
              <Icon image="ic-1" style={{ marginRight: 4 }} />
            </Link>
            <Link to={`/companies/${company.id}/partner-network`}>
              <Icon image="ic-2" />
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};

export default CompanyTitle;
