import React from 'react';
import { Route, Link, useRouteMatch, useParams, useHistory } from 'react-router-dom';
import classNames from 'classnames';

import { Nav, NavItem, NavLink } from 'reactstrap';

import classses from './Tabs.module.scss';

import IndustryAdd from 'components/Industries/IndustryAdd';
import IndustryUpdate from 'components/Industries/IndustryUpdate';
import IndustryClone from 'components/Industries/IndustryClone';
import IndustryDelete from 'components/Industries/IndustryDelete';
import IndustryTitle from 'components/Industries/IndustryTitle';

const IndustryTabs = ({ industries = [], refetchIndustries, baseUrl }) => {
  let history = useHistory();
  const { path, url } = useRouteMatch();
  let { industryId } = useParams();
  industryId = parseInt(industryId, 10);
  let currentIndustry = industries && industries.find(ind => ind.id === industryId);
  let enities = String(url).split('/')[1];

  return (
    <React.Fragment>
      <Nav className={classses.Nav}>
        {Array.from(industries || []).map(industry => {
          let empty = false;
          if (
            (enities === 'processes' && industry.countProcesses <= 1) ||
            (enities === 'capabilities' && industry.countCapabilities <= 1) ||
            (enities === 'startups' && industry.countStartups === 0)
          ) {
            empty = true;
          }
          return (
            <NavItem className={classses.NavItem} key={industry.id}>
              <NavLink
                className={classNames(classses.NavLink, {
                  [classses.active]: industry.id === industryId,
                  [classses.empty]: empty,
                })}
                tag={Link}
                to={`${baseUrl}/${industry.id}`}
              >
                {industry.name}
              </NavLink>
            </NavItem>
          );
        })}
        <NavItem className={classses.NavItem} key={`add`}>
          <NavLink className={classses.NavLinkAdd} tag={Link} to={`${url}/add-industry`}>
            <i className="fa fa-plus" /> Add Industry
          </NavLink>
        </NavItem>
      </Nav>
      <IndustryTitle industry={currentIndustry} />
      <Route path={`${path}/add-industry`}>
        <IndustryAdd
          redirect={false}
          onComplete={async node => {
            await refetchIndustries();
            history.push(`${baseUrl}/${node.id}`);
          }}
        />
      </Route>
      <Route path={`${path}/update-industry`}>
        <IndustryUpdate
          redirect={false}
          onComplete={async node => {
            await refetchIndustries();
            history.push(`${baseUrl}/${node.id}`);
          }}
        />
      </Route>
      <Route path={`${path}/clone-industry`}>
        <IndustryClone
          redirect={false}
          onComplete={async node => {
            await refetchIndustries();
            history.push(`${baseUrl}/${node.id}`);
          }}
        />
      </Route>
      <Route path={`${path}/delete-industry`}>
        <IndustryDelete
          redirect={false}
          onComplete={async ({ id }) => {
            let firstInd = industries.find(ind => ind.id !== +id);
            let nodeId = firstInd ? firstInd.id : 1;
            await refetchIndustries();
            history.push(`${baseUrl}/${nodeId}`);
          }}
          industry={currentIndustry}
        />
      </Route>
    </React.Fragment>
  );
};

export default IndustryTabs;
