import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import _ from 'lodash';
import { map } from 'react-sortable-tree';

import { getTreeProcessesAction } from 'api/actions';

import Spinner from 'components/Spinner';
import TreeProcesses from 'components/Processes/TreeProcesses';

const TreeProcessesContainer = () => {
  const { industryId } = useParams();
  const { loading, payload: tree = {}, query } = useQuery(getTreeProcessesAction(industryId));
  const sortedData = map({
    treeData: [tree],
    getNodeKey({ node }) {
      return node.id;
    },
    callback({ node }) {
      node.children = _.orderBy(node.children, ['name'], ['asc']);
      return node;
    },
  });

  return loading ? (
    <Spinner />
  ) : (
    <TreeProcesses
      tree={sortedData[0] && sortedData[0].children}
      rootNode={_.omit(sortedData[0], 'children')}
      refetchProcesses={query}
    />
  );
};

export default TreeProcessesContainer;
