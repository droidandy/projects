import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';

import { getCompanyAction } from 'api/actions';

import Spinner from 'components/Spinner';
import CompanyTitle from './CompanyTitle';
import PartnerNetworkTable from './PartnerNetworkTable';
import PartnerNetworkTagCaps from './PartnerNetworkTagCaps';

import classes from './styles.module.scss';
import './styles.scss';

export default () => {
  const match = useRouteMatch();
  const { loading, payload: company = {}, query: refetchCompany } = useQuery(
    getCompanyAction(match.params)
  );

  return loading ? (
    <Spinner />
  ) : (
    <div className={classes.companyEdit}>
      <CompanyTitle company={company} unsaved={false} />
      <Switch>
        <Route path={`${match.path}/:partnerNetworkId/tag-caps`}>
          <PartnerNetworkTagCaps
            company={company}
            industryId={company.industry_id}
            refetchCompany={refetchCompany}
          />
        </Route>
        <Route path={`${match.path}/table`}>
          <PartnerNetworkTable company={company} refetchCompany={refetchCompany} />
        </Route>
        <Redirect from={match.path} to={`${match.path}/table`} />
      </Switch>
    </div>
  );
};
