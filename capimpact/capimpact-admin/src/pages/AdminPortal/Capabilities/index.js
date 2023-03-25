import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';

import { getIndustriesAction } from 'api/actions';

import Spinner from 'components/Spinner';
import PageTitle from 'components/PageTitle';
import IndustryTabs from 'components/Industries/IndustryTabs';

import TreeCapabilities from './TreeCapabilities';

const Capabilities = () => {
  const { loading, payload: industries = [], query: refetchIndustries } = useQuery(
    getIndustriesAction()
  );
  let { path, url } = useRouteMatch();

  return (
    <div className="d-flex flex-column h-100">
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <PageTitle title="CapTrees" />
          <Switch>
            <Route path={`${path}/:industryId`}>
              <React.Fragment>
                <IndustryTabs
                  industries={industries}
                  refetchIndustries={refetchIndustries}
                  baseUrl={url}
                />
                <TreeCapabilities baseUrl={url} />
              </React.Fragment>
            </Route>
            <Route path={path}>
              <Redirect to={`/capabilities/1`} />
            </Route>
          </Switch>
        </React.Fragment>
      )}
    </div>
  );
};

export default Capabilities;
