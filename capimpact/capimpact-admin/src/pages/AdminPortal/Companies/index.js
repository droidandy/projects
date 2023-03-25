import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import CompaniesMenu from 'components/Companies/Menu';
import CompanyView from 'components/Companies/View';
import CompanyEdit from 'components/Companies/BuEdit';
import CompanyPartnerNetwork from 'components/Companies/PartnerNetwork';

export default () => {
  const match = useRouteMatch();
  return (
    <div className="d-flex flex-column h-100">
      <Switch>
        <Route path={`${match.path}/:companyId/view`}>
          <CompanyView />
        </Route>
        <Route path={`${match.path}/:companyId/edit`}>
          <CompanyEdit />
        </Route>
        <Route path={`${match.path}/:companyId/partner-network`}>
          <CompanyPartnerNetwork />
        </Route>
        <Route>
          <CompaniesMenu />
        </Route>
      </Switch>
    </div>
  );
};
