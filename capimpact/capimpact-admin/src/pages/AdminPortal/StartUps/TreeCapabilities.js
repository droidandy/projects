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
  const { loading, payload: tree = {} } = useQuery(
    getTreeCapabilitiesAction({ industry_id: props.industryId })
  );

  if (loading) {
    return <Spinner />;
  }

  return <TreeCapabilities {...props} tree={tree.children} />;
};

const TreeCapabilities = ({
  tree = [],
  startup = {},
  selectedNodes = [],
  setSelectedNodes,
  ...props
}) => {
  selectedNodes = Array.from(selectedNodes || []);
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
                  if (startup && startup.id) {
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

/*
  // make array of selected nodes with paths
  const selectedNodesWithPaths = Array.from(selectedNodes || [])
    .map(sn => {
      const found = data.find(it => it.node.id === sn.id);
      if (found) {
        return {
          id: found.node.id,
          path: found.path,
        };
      }
      return null;
    })
    .filter(v => !!v);
  // make array of selected node ids
  const selectedNodesIds = selectedNodesWithPaths.map(n => n.id);
          const selectable =
            selectedNodesIds.includes(node.id) ||
            (!selectedNodesWithPaths.some(it => node.id !== it.id && it.path.includes(node.id)) &&
              _.intersection(node.path, selectedNodesIds).length === 0);

  const [searchQuery, setSearchQuery] = useState();
<div className="form-group">
        <input
          className="form-control"
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
        />
      </div>
searchMethod={({ node, path, treeIndex, searchQuery }) => {
          return node['name'] && String(node['name']).indexOf(searchQuery) > -1;
        }}
        searchQuery={searchQuery}
*/
