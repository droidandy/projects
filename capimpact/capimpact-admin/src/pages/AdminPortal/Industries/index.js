import React from 'react';
import { Switch, Route, Link, Redirect, useRouteMatch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';

import { getIndustriesAction } from 'api/actions';

import Spinner from 'components/Spinner';
import PageTitle from 'components/PageTitle';
import IndustryTabs from 'components/Industries/IndustryTabs';
import IndustryAdd from 'components/Industries/IndustryAdd';
import IndustryUpdate from 'components/Industries/IndustryUpdate';
import IndustryClone from 'components/Industries/IndustryClone';
import IndustryDelete from 'components/Industries/IndustryDelete';

//import TreeProcesses from './TreeProcesses';

const Industries = () => {
  const { loading, payload: industries = [], query: refetchIndustries } = useQuery(
    getIndustriesAction()
  );
  let match = useRouteMatch();
  let history = useHistory();
  let industryId = match.params.industryId || 1;

  return (
    <div className="d-flex flex-column h-100">
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          {/*<PageTitle
            title="CapProcesses"
            subtitle={
              <Link className="link" to={`/original-processes/1`}>
                <small>View Original APQC Processes</small>
              </Link>
            }
          />
          <Switch>
            <Route path={`${path}/:industryId`}>
              <React.Fragment>
                <IndustryTabs industries={industries} baseUrl={url} />
                <TreeProcesses baseUrl={url} />
                <Route path={`${path}/:industryId/add-industry`}>
                  <IndustryAdd onComplete={refetchIndustries} />
                </Route>
                <Route path={`${path}/:industryId/update-industry`}>
                  <IndustryUpdate onComplete={refetchIndustries} />
                </Route>
                <Route path={`${path}/:industryId/clone-industry`}>
                  <IndustryClone onComplete={refetchIndustries} />
                </Route>
                <Route path={`${path}/:industryId/delete-industry`}>
                  <IndustryDelete
                    onComplete={async ({ id }) => {
                      let inds = industries.filter(ind => ind.id !== +id);
                      await refetchIndustries();
                      history.push(`/processes/${inds[0].id}`);
                    }}
                  />
                </Route>
              </React.Fragment>
            </Route>
            <Route path={path}>
              <Redirect to={`/processes/1`} />
            </Route>
          </Switch>*/}
        </React.Fragment>
      )}
    </div>
  );
};

export default Industries;
