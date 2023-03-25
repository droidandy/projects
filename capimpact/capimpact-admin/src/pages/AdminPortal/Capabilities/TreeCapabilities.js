import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import _ from 'lodash';

import { getTreeCapabilitiesAction, getKpilibsAction } from 'api/actions';

import Spinner from 'components/Spinner';
import TreeCapabilities from 'components/Capabilities/TreeCapabilities';

const TreeCapabilitiesContainer = () => {
  const params = useParams();
  const { industryId } = params;
  const { loading: l1, payload: tree = {}, query } = useQuery(
    getTreeCapabilitiesAction({ industry_id: industryId })
  );
  const { loading: l2, payload: kpilibs = [] } = useQuery(getKpilibsAction(params));

  const loading = l1 || l2;

  return loading ? (
    <Spinner />
  ) : (
    <TreeCapabilities
      tree={tree.children}
      rootNode={_.omit(tree, 'children')}
      kpilibs={kpilibs}
      refetchCapabilities={query}
    />
  );
};

export default TreeCapabilitiesContainer;
