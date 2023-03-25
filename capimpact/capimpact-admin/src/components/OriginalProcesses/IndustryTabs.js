import React from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';

import { Nav, NavItem, NavLink } from 'reactstrap';

import classses from 'components/Industries/Tabs.module.scss';

import IndustryTitle from './IndustryTitle';

const IndustryTabs = ({ industries = [], baseUrl }) => {
  let { industryId } = useParams();
  industryId = parseInt(industryId, 10);
  let currentIndustry = industries.find(ind => ind.id === industryId);

  return (
    <React.Fragment>
      <Nav className={classses.Nav}>
        {industries.map(industry => (
          <NavItem className={classses.NavItem} key={industry.id}>
            <NavLink
              className={classNames(classses.NavLink, {
                [classses.active]: industry.id === industryId,
              })}
              tag={Link}
              to={`${baseUrl}/${industry.id}`}
            >
              {industry.name}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
      <IndustryTitle industry={currentIndustry} />
    </React.Fragment>
  );
};

export default IndustryTabs;
