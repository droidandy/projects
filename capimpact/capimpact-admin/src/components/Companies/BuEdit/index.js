import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';

import { getCompanyAction } from 'api/actions';

import Spinner from 'components/Spinner';
import CompanyTitle from '../CompanyTitle';
import BuSpendFte from './BuSpendFte';
import BuLenses from './BuLenses';
import BuCaps from './BuCaps';
import BuTags from './BuTags';
import BuFilters from './BuFilters';

import classes from '../styles.module.scss';

export default () => {
  const match = useRouteMatch();
  const { loading, payload: company = {}, query: refetchCompany } = useQuery(
    getCompanyAction(match.params)
  );

  const props = {
    company,
    refetchCompany,
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className={classes.companyEdit}>
      <CompanyTitle company={company} unsaved={false} />
      <Switch>
        <Route path={`${match.path}/spend-fte`}>
          <BuSpendFte {...props} />
        </Route>
        <Route path={`${match.path}/lenses`}>
          <BuLenses {...props} />
        </Route>
        <Route path={`${match.path}/caps`}>
          <BuCaps {...props} />
        </Route>
        <Route path={`${match.path}/tags`}>
          <BuTags {...props} />
        </Route>
        <Route path={`${match.path}/filters/:parentId?`}>
          <BuFilters {...props} />
        </Route>
      </Switch>
    </div>
  );
};
