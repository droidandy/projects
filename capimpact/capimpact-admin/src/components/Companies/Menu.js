import React from 'react';
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import _ from 'lodash';

import { getCompaniesAction } from 'api/actions';

import Spinner from 'components/Spinner';
import CompanyActions from 'components/Companies/CompanyActions';
import CompanyAdd from 'components/Companies/CompanyAdd';
import CompanyUpdate from 'components/Companies/CompanyUpdate';
import CompanyClone from 'components/Companies/CompanyClone';
import CompanyDelete from 'components/Companies/CompanyDelete';

import './Menu.scss';

export default () => {
  const match = useRouteMatch();
  const { loading, payload: companies = [], query: refetchCompanies } = useQuery(
    getCompaniesAction()
  );
  const groupByIndustries = _(_.groupBy(companies, 'industry.name'))
    .toPairs()
    .sortBy(0)
    .fromPairs()
    .value();

  return (
    <React.Fragment>
      <h2 className="page-title my-2 align-items-center">
        <span className="text" style={{ marginRight: 15 }}>
          Companies
        </span>
        <Link className="btn btn-primary" to={`${match.url}/add`}>
          Add Company
        </Link>
      </h2>

      {loading ? (
        <Spinner />
      ) : (
        <div className="companies-menu">
          {companies && companies.length > 0 ? (
            Object.keys(groupByIndustries).map(industryName => (
              <div key={industryName} className="companies-menu-group">
                <h3 className="companies-menu-group-title">{industryName}</h3>
                <ul className="nav flex-column">
                  {groupByIndustries[industryName].map(company => (
                    <li key={company.id} className="nav-item">
                      <div className="d-flex align-items-center">
                        <div className="my-2">{company.name}</div>
                        <CompanyActions company={company} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center">No companies</div>
          )}
        </div>
      )}

      <Switch>
        <Route path={`${match.path}/add/:industryId?`}>
          <CompanyAdd
            onComplete={async () => {
              await refetchCompanies();
            }}
          />
        </Route>
        <Route path={`${match.path}/update/:companyId`}>
          <CompanyUpdate
            onComplete={async () => {
              await refetchCompanies();
            }}
          />
        </Route>
        <Route path={`${match.path}/clone/:companyId`}>
          <CompanyClone
            onComplete={async () => {
              await refetchCompanies();
            }}
          />
        </Route>
        <Route path={`${match.path}/delete/:companyId`}>
          <CompanyDelete
            onComplete={async () => {
              await refetchCompanies();
            }}
          />
        </Route>
      </Switch>
    </React.Fragment>
  );
};
