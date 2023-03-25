import React from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { useMutation } from 'react-fetching-library';
import SortableTree from 'react-sortable-tree';

import 'react-sortable-tree/style.css';
import './Tree.scss';

import { saveProcessAction, saveProcessesAction } from 'api/actions';

import ProcessAdd from 'components/Processes/ProcessAdd';
//import ProcessUpdate from 'components/Processes/ProcessUpdate';
import ProcessDelete from 'components/Processes/ProcessDelete';

import TreeToolbar from 'components/Tree/Toolbar';
import TreeBreadcrumbs from 'components/Tree/Breadcrumbs';
import TreeNodeTitle from 'components/Tree/NodeTitle';
import TreeNodeTitleEdit from 'components/Tree/NodeTitleEdit';
import TreeNodeView from 'components/Tree/NodeView';

import useTree from 'components/Tree/useTree';

const TreeProcesses = ({ tree = [], rootNode, refetchProcesses }) => {
  let history = useHistory();
  const { path, url } = useRouteMatch();
  const { mutate: saveProcesses } = useMutation(saveProcessesAction);
  const { mutate: saveProcess } = useMutation(saveProcessAction);
  const {
    treeData,
    data,
    setTreeData,

    selectedNode,
    setSelectedNode,

    editAll,

    updatedNodes,

    toggleNodeExpansion,
    expandNodeWithDescendantsAndSetEditable,

    enableEditAll,
    saveAll,
    cancelSavingAll,

    save,
    cancelSave,

    addNode,
    getNodeValue,
    handleChangeNode,
    removeNode,

    getNodeKey,
  } = useTree({
    tree,
    rootNode,
    refetchTree: refetchProcesses,
    saveNode: saveProcess,
    saveNodes: saveProcesses,
  });

  return (
    <div>
      <div className="sticky-top">
        <TreeToolbar
          selectedNode={selectedNode}
          isNodeSelected={!!selectedNode}
          isSaving={editAll || Object.values(updatedNodes).length > 0}
          expandAll={() => toggleNodeExpansion(true)}
          collapseAll={() => toggleNodeExpansion(false)}
          addSibling={() => {
            history.push(`${url}/add-process/${selectedNode.parentId}`);
          }}
          addChild={() => {
            history.push(`${url}/add-process/${selectedNode.id}`);
          }}
          saveAll={saveAll}
          cancelSavingAll={cancelSavingAll}
          enableEditAll={enableEditAll}
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
            title:
              editAll || updatedNodes[node.id] ? (
                <TreeNodeTitleEdit
                  node={updatedNodes[node.id]}
                  editAll={editAll}
                  value={getNodeValue('name', node)}
                  onChange={handleChangeNode('name', node)}
                  save={save}
                  cancel={cancelSave}
                />
              ) : (
                <TreeNodeTitle
                  node={node}
                  selectedNode={selectedNode}
                  selectNode={setSelectedNode}
                  editNode={node => {
                    expandNodeWithDescendantsAndSetEditable({ node });
                  }}
                  deleteNode={node => history.push(`${url}/delete-process/${node.id}`)}
                />
              ),
          };
        }}
      />
      {selectedNode && <TreeNodeView title="Process" node={{ ...selectedNode }} />}
      <Switch>
        <Route path={`${path}/add-process/:parentId?`}>
          <ProcessAdd onComplete={addNode} />
        </Route>
        <Route path={`${path}/delete-process/:processId`}>
          <ProcessDelete onComplete={removeNode} />
        </Route>
      </Switch>
    </div>
  );
};

export default TreeProcesses;
