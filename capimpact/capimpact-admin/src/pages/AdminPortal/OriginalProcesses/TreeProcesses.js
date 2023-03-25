import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { getTreeFromFlatData } from 'react-sortable-tree';

import { getTreeOriginalProcessesAction } from 'api/actions';

import Spinner from 'components/Spinner';
import TreeProcesses from 'components/OriginalProcesses/TreeProcesses';

const TreeProcessesContainer = () => {
  const { industryId } = useParams();
  const { loading, payload: flatData = {} } = useQuery(getTreeOriginalProcessesAction(industryId));
  const tree =
    !loading &&
    getTreeFromFlatData({
      flatData,
      getKey(node) {
        return node.id;
      },
      getParentKey(node) {
        return node.parentId;
      },
      rootKey: null,
    });
  return loading ? <Spinner /> : <TreeProcesses tree={tree} />;
};

export default TreeProcessesContainer;
