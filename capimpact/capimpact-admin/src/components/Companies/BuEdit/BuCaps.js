import React from 'react';
import compose from 'recompose/compose';
import { Route, Switch, useRouteMatch, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from 'react-fetching-library';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import _ from 'lodash';
import withConfirm from 'lib/withConfirm';
import SortableTree from 'react-sortable-tree';

import 'react-sortable-tree/style.css';
import 'components/Tree/Tree.scss';

import {
  getTreeCapabilitiesAction,
  saveCapabilityAction,
  saveCapabilitiesAction,
} from 'api/actions';

import useTree from 'components/Tree/useTree';
import TreeToolbar from 'components/Tree/Toolbar';
import TreeNodeTitle from 'components/Tree/NodeTitle';
import TreeNodeTitleEdit from 'components/Tree/NodeTitleEdit';

import CapabilityAdd from '../CapabilityAdd';
import CapabilityDelete from '../CapabilityDelete';

import classes from '../styles.module.scss';

const BuCaps = ({ company, tree, rootNode, refetch }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const { mutate: saveCapabilities } = useMutation(saveCapabilitiesAction);
  const { mutate: saveCapability } = useMutation(saveCapabilityAction);
  const {
    treeData,
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
    refetchTree: refetch,
    saveNode: saveCapability,
    saveNodes: saveCapabilities,
  });
  const goToView = () => history.push(`/companies/${company.id}/view`);

  return (
    <div className={classNames(classes.buEditTableContainer)}>
      <div className="d-flex flex-column">
        <div className="d-flex align-items-end">
          <Button
            className="mr-3"
            type="button"
            color="danger"
            onClick={async () => {
              await refetch();
              goToView();
            }}
          >
            Done
          </Button>
        </div>
        <div className="my-4">
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
                maxLevels={2}
              />
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
                        node={updatedNodes[node.id] || node}
                        editAll={editAll}
                        value={getNodeValue('name', node)}
                        onChange={handleChangeNode('name', node)}
                        save={save}
                        cancel={cancelSave}
                        deleteNode={node =>
                          history.push(`${match.url}/delete-capability/${node.id}`)
                        }
                      />
                    ) : (
                      <TreeNodeTitle
                        node={node}
                        selectedNode={selectedNode}
                        selectNode={setSelectedNode}
                        editNode={node => {
                          expandNodeWithDescendantsAndSetEditable({ node });
                        }}
                        deleteNode={node =>
                          history.push(`${match.url}/delete-capability/${node.id}`)
                        }
                      />
                    ),
                };
              }}
            />
            <Switch>
              <Route path={`${match.path}/add-capability/:parentId?`}>
                <CapabilityAdd onComplete={addNode} />
              </Route>
              <Route path={`${match.path}/delete-capability/:capabilityId`}>
                <CapabilityDelete onComplete={removeNode} />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuCapsContainer = ({ company, confirm }) => {
  const { loading, payload: tree = {}, query: refetch } = useQuery(
    getTreeCapabilitiesAction({ company_id: company.id })
  );

  return (
    !loading && (
      <BuCaps
        company={company}
        tree={tree.children}
        rootNode={_.omit(tree, 'children')}
        refetch={refetch}
        confirm={confirm}
      />
    )
  );
};

export default compose(withConfirm)(BuCapsContainer);
