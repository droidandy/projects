import React, { useEffect } from 'react';
import SortableTree from 'react-sortable-tree';
import { useQuery } from 'react-fetching-library';

import { getTreeCapabilitiesAction } from 'api/actions';

import 'react-sortable-tree/style.css';
import 'components/Tree/Tree.scss';

import Spinner from 'components/Spinner';
import TreeNodeTitle from 'components/Tree/NodeTitle';
import useTree from 'components/Tree/useTree';

const TreeCapabilitiesContainer = props => {
  const { company } = props;
  const { loading, payload: tree = {} } = useQuery(
    getTreeCapabilitiesAction({ company_id: company.id })
  );

  if (loading) {
    return <Spinner />;
  }

  return <TreeCapabilities {...props} tree={tree.children} />;
};

const TreeCapabilities = ({
  tree = [],
  partnerNetwork,
  selectedNodes,
  setSelectedNodes,
  ...props
}) => {
  const { treeData, setTreeData, getNodeKey, toggleNodeExpansion } = useTree({
    tree,
  });
  // make array of selected node ids
  const selectedNodesIds = selectedNodes.map(n => n.id);

  //Auto expnad all nodes
  useEffect(() => {
    toggleNodeExpansion(true);
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <SortableTree
        treeData={treeData}
        onChange={setTreeData}
        isVirtualized={false}
        getNodeKey={getNodeKey}
        generateNodeProps={({ node, path }) => {
          node = { ...node, path };

          // selectable: node selected or 2nd level only
          const selectable = selectedNodesIds.includes(node.id) || node.path.length === 2;

          return {
            canDrag: false,
            title: (
              <TreeNodeTitle
                node={node}
                selectable={selectable}
                selectedNode={selectedNodes.findIndex(it => it.id === node.id) >= 0 ? node : null}
                selectNode={node => {
                  if (partnerNetwork && partnerNetwork.id) {
                    let key = node.id;
                    let selection = [...selectedNodes];
                    const keyIndex = selection.findIndex(it => it.id === key);
                    if (keyIndex >= 0) {
                      selection = [
                        ...selection.slice(0, keyIndex),
                        ...selection.slice(keyIndex + 1),
                      ];
                    } else {
                      selection.push({
                        id: node.id,
                        name: node.name,
                      });
                    }
                    setSelectedNodes(selection);
                  }
                }}
              />
            ),
          };
        }}
        {...props}
      />
    </React.Fragment>
  );
};

export default TreeCapabilitiesContainer;
