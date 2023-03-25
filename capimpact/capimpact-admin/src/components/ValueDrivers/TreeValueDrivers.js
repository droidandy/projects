import React from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { useMutation } from 'react-fetching-library';
import SortableTree from 'react-sortable-tree';

import 'react-sortable-tree/style.css';
import './Tree.scss';

import { saveValueDriverAction, saveValueDriversAction } from 'api/actions';

import ValueDriverAdd from 'components/ValueDrivers/ValueDriverAdd';
//import ValueDriverUpdate from 'components/ValueDrivers/ValueDriverUpdate';
import ValueDriverDelete from 'components/ValueDrivers/ValueDriverDelete';
import ValueDriverKpis from 'components/ValueDrivers/ValueDriverKpis';

import TreeToolbar from 'components/Tree/Toolbar';
import TreeBreadcrumbs from 'components/Tree/Breadcrumbs';
import TreeNodeTitle from 'components/Tree/NodeTitle';
import TreeNodeTitleEdit from 'components/Tree/NodeTitleEdit';
import TreeNodeView from 'components/Tree/NodeView';

import useTree from 'components/Tree/useTree';

const TreeValueDrivers = ({ tree = [], rootNode, kpilibs = [], refetchValueDrivers }) => {
  let history = useHistory();
  const match = useRouteMatch();
  const { mutate: saveValueDrivers } = useMutation(saveValueDriversAction);
  const { mutate: saveValueDriver } = useMutation(saveValueDriverAction);
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

    findNodeById,
    updateNode,
    addNode,
    getNodeValue,
    handleChangeNode,
    removeNode,

    getNodeKey,
  } = useTree({
    tree,
    rootNode,
    refetchTree: refetchValueDrivers,
    saveNode: saveValueDriver,
    saveNodes: saveValueDrivers,
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
            history.push(
              `${match.url}/add-valueDriver/${selectedNode ? selectedNode.parentId : rootNode.id}`
            );
          }}
          addChild={() => {
            history.push(`${match.url}/add-valueDriver/${selectedNode.id}`);
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
                  deleteNode={node => history.push(`${match.url}/delete-valueDriver/${node.id}`)}
                  icons={[
                    {
                      icon: 'fa-tags',
                      onClick: () => history.push(`${match.url}/kpis-valueDriver/${node.id}`),
                    },
                  ]}
                />
              ),
          };
        }}
      />
      {selectedNode && (
        <TreeNodeView
          title="ValueDriver"
          node={findNodeById({ nodeId: selectedNode.id, data })}
          kpilibs={kpilibs}
        />
      )}
      <Switch>
        <Route path={`${match.path}/add-valueDriver/:parentId?`}>
          <ValueDriverAdd onComplete={addNode} />
        </Route>
        <Route path={`${match.path}/kpis-valueDriver/:valueDriverId`}>
          <ValueDriverKpis
            kpilibs={kpilibs}
            onComplete={node => {
              updateNode(node);
              history.push(match.url);
            }}
          />
        </Route>
        <Route path={`${match.path}/delete-valueDriver/:valueDriverId`}>
          <ValueDriverDelete onComplete={removeNode} />
        </Route>
      </Switch>
    </div>
  );
};

export default TreeValueDrivers;
