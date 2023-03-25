import React from 'react';
import SortableTree from 'react-sortable-tree';

import 'react-sortable-tree/style.css';
import './Tree.scss';

import TreeBreadcrumbs from 'components/Tree/Breadcrumbs';
import TreeNodeTitle from 'components/Tree/NodeTitle';
import TreeNodeView from 'components/Tree/NodeView';
//import TreeToolbar from 'components/OriginalProcesses/TreeToolbar';
import TreeToolbar from 'components/Tree/Toolbar';

import useTree from 'components/Tree/useTree';

const TreeProcesses = ({ tree = [] }) => {
  const {
    treeData,
    data,
    setTreeData,
    selectedNode,
    setSelectedNode,
    toggleNodeExpansion,
    getNodeKey,
  } = useTree({
    tree,
  });

  return (
    <div>
      <div className="sticky-top">
        <TreeToolbar
          selectedNode={selectedNode}
          expandAll={() => toggleNodeExpansion(true)}
          collapseAll={() => toggleNodeExpansion(false)}
        />
        <TreeBreadcrumbs selectedNode={selectedNode} data={data} onClick={setSelectedNode} />
      </div>
      <SortableTree
        treeData={treeData}
        onChange={setTreeData}
        isVirtualized={false}
        getNodeKey={getNodeKey}
        generateNodeProps={({ node, path }) => {
          node = { ...node, path };
          return {
            canDrag: false,
            title: (
              <TreeNodeTitle node={node} selectedNode={selectedNode} selectNode={setSelectedNode} />
            ),
          };
        }}
      />
      {selectedNode && <TreeNodeView title="Process" node={{ ...selectedNode }} />}
    </div>
  );
};

export default TreeProcesses;
