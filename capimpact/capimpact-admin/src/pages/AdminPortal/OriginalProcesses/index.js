import React from 'react';
import { Switch, Route, Link, Redirect, useRouteMatch, useLocation } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';

import { getIndustriesAction } from 'api/actions';

import Spinner from 'components/Spinner';
import PageTitle from 'components/PageTitle';
import IndustryTabs from 'components/OriginalProcesses/IndustryTabs';

import TreeProcesses from './TreeProcesses';

const OriginalProcesses = () => {
  const { loading, payload: industries = [] } = useQuery(getIndustriesAction());
  let { path, url } = useRouteMatch();
  const location = useLocation();
  const industryId = String(location.pathname).split('/')[2] || 1;

  return (
    <div className="d-flex flex-column h-100">
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <PageTitle
            title="Original APQC processes"
            subtitle={
              <Link className="link" to={`/processes/${industryId}`}>
                <small>View Cap Processes</small>
              </Link>
            }
          />
          <Switch>
            <Route path={`${path}/:industryId`}>
              <React.Fragment>
                <IndustryTabs industries={industries} baseUrl={url} />
                <TreeProcesses baseUrl={url} />
              </React.Fragment>
            </Route>
            <Route path={path}>
              <Redirect to={`/original-processes/1`} />
            </Route>
          </Switch>
        </React.Fragment>
      )}
    </div>
  );
};

export default OriginalProcesses;
