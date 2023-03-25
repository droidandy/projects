import React from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';

import { getIndustriesAction } from 'api/actions';

import Spinner from 'components/Spinner';
import IndustryTabs from 'components/Industries/IndustryTabs';

import StartUpsTable from './StartUpsTable';
import StartUpsTagCaps from './StartUpsTagCaps';

import './styles.scss';

const Startups = () => {
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
          <div className="page-title h3 text-left mt-3 d-flex flex-row align-items-center">
            <span className="text">Start Ups</span>
          </div>
          <Switch>
            <Route path={`${path}/:industryId`}>
              <React.Fragment>
                <IndustryTabs
                  industries={industries}
                  refetchIndustries={refetchIndustries}
                  baseUrl={url}
                />
                <Switch>
                  <Route path={`${path}/:industryId/cap-tags`}>
                    <StartUpsTagCaps industries={industries} />
                  </Route>
                  <Route path={`${path}/:industryId`}>
                    <StartUpsTable industries={industries} />
                  </Route>
                </Switch>
              </React.Fragment>
            </Route>
            <Route path={path}>
              <Redirect to={`/startups/1`} />
            </Route>
          </Switch>
        </React.Fragment>
      )}
    </div>
  );
};

export default Startups;
