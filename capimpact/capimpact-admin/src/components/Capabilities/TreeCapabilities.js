import React from 'react';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { useMutation } from 'react-fetching-library';
import SortableTree from 'react-sortable-tree';

import 'react-sortable-tree/style.css';
import './Tree.scss';

import { saveCapabilityAction, saveCapabilitiesAction } from 'api/actions';

import CapabilityAdd from 'components/Capabilities/CapabilityAdd';
//import CapabilityUpdate from 'components/Capabilities/CapabilityUpdate';
import CapabilityDelete from 'components/Capabilities/CapabilityDelete';
import CapabilityKpis from 'components/Capabilities/CapabilityKpis';

import TreeToolbar from 'components/Tree/Toolbar';
import TreeBreadcrumbs from 'components/Tree/Breadcrumbs';
import TreeNodeTitle from 'components/Tree/NodeTitle';
import TreeNodeTitleEdit from 'components/Tree/NodeTitleEdit';
import TreeNodeView from 'components/Tree/NodeView';

import useTree from 'components/Tree/useTree';

const TreeCapabilities = ({ tree = [], rootNode, kpilibs = [], refetchCapabilities }) => {
  let history = useHistory();
  const match = useRouteMatch();
  const { mutate: saveCapabilities } = useMutation(saveCapabilitiesAction);
  const { mutate: saveCapability } = useMutation(saveCapabilityAction);
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
    addNode,
    updateNode,
    getNodeValue,
    handleChangeNode,
    removeNode,

    getNodeKey,
  } = useTree({
    tree,
    rootNode,
    refetchTree: refetchCapabilities,
    saveNode: saveCapability,
    saveNodes: saveCapabilities,
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
            history.push(`${match.url}/add-capability/${selectedNode.parentId}`);
          }}
          addChild={() => {
            history.push(`${match.url}/add-capability/${selectedNode.id}`);
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
                  deleteNode={node => history.push(`${match.url}/delete-capability/${node.id}`)}
                  icons={[
                    {
                      icon: 'fa-tags',
                      onClick: () => history.push(`${match.url}/kpis-capability/${node.id}`),
                    },
                  ]}
                />
              ),
          };
        }}
      />
      {selectedNode && (
        <TreeNodeView
          title="Capability"
          node={findNodeById({ nodeId: selectedNode.id, data })}
          kpilibs={kpilibs}
        />
      )}
      <Switch>
        <Route path={`${match.path}/add-capability/:parentId?`}>
          <CapabilityAdd onComplete={addNode} />
        </Route>
        <Route path={`${match.path}/kpis-capability/:capabilityId`}>
          <CapabilityKpis
            kpilibs={kpilibs}
            onComplete={node => {
              updateNode(node);
              history.push(match.url);
            }}
          />
        </Route>
        <Route path={`${match.path}/delete-capability/:capabilityId`}>
          <CapabilityDelete onComplete={removeNode} />
        </Route>
      </Switch>
    </div>
  );
};

export default TreeCapabilities;
