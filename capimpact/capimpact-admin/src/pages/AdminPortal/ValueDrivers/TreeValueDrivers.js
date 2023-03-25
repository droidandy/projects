import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import _ from 'lodash';

import { getTreeValueDriversAction, getKpilibsAction } from 'api/actions';

import Spinner from 'components/Spinner';
import TreeValueDrivers from 'components/ValueDrivers/TreeValueDrivers';

const TreeValueDriversContainer = () => {
  const params = useParams();
  const { industryId } = params;
  const { loading: l1, payload: tree = {}, query } = useQuery(
    getTreeValueDriversAction({ industryId })
  );
  const { loading: l2, payload: kpilibs = [] } = useQuery(getKpilibsAction(params));

  const loading = l1 || l2;

  return loading ? (
    <Spinner />
  ) : (
    <React.Fragment>
      {tree && tree.id ? (
        <TreeValueDrivers
          tree={tree.children}
          rootNode={_.omit(tree, 'children')}
          kpilibs={kpilibs}
          refetchValueDrivers={query}
        />
      ) : null}
    </React.Fragment>
  );
};

export default TreeValueDriversContainer;
