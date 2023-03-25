import { useState } from 'react';
import {
  getFlatDataFromTree,
  toggleExpandedForAll,
  changeNodeAtPath,
  addNodeUnderParent,
  removeNodeAtPath,
  map as mapTree,
} from 'react-sortable-tree';

const getNodeKey = ({ node }) => node.id;

const findNodeById = ({ data, nodeId }) => {
  const result = data.find(({ node }) => node.id === nodeId);
  if (result) {
    return {
      ...result.node,
      path: result.path,
    };
  }
};

const isDescendant = (older, younger) => {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(child => child.id === younger.id || isDescendant(child, younger))
  );
};

const useTree = ({ tree, rootNode, saveNode, saveNodes, refetchTree }) => {
  const [treeData, setTreeData] = useState(tree);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editAll, setEditAll] = useState(false);
  const [updatedNodes, setUpdatedNodes] = useState({});
  const data = getFlatDataFromTree({
    treeData,
    getNodeKey,
    ignoreCollapsed: false,
  });

  const addNode = node => {
    setTreeData(
      addNodeUnderParent({
        treeData,
        parentKey: node.parentId === rootNode.id ? null : node.parentId,
        getNodeKey,
        newNode: node,
        ignoreCollapsed: false,
        expandParent: true,
        addAsFirstChild: false,
      }).treeData
    );
  };

  const updateNode = node => {
    const nodeId = parseInt(node.id, 10);
    const oldNode = findNodeById({ nodeId, data });
    setTreeData(
      changeNodeAtPath({
        treeData,
        path: oldNode.path,
        getNodeKey,
        newNode: {
          ...oldNode,
          ...node,
        },
      })
    );
  };

  const updateNodes = nodes => {
    let changedTreeData = treeData;
    let changedData = getFlatDataFromTree({
      treeData: changedTreeData,
      getNodeKey,
      ignoreCollapsed: false,
    });
    for (let newNode of nodes) {
      changedData = getFlatDataFromTree({
        treeData: changedTreeData,
        getNodeKey,
        ignoreCollapsed: false,
      });
      const oldNode = findNodeById({ nodeId: newNode.id, data: changedData });
      changedTreeData = changeNodeAtPath({
        treeData: changedTreeData,
        path: oldNode.path,
        getNodeKey,
        newNode: {
          ...oldNode,
          ...newNode,
        },
      });
    }
    setTreeData(changedTreeData);
  };

  const removeNode = node => {
    const nodeId = parseInt(node.id, 10);
    const foundNode = findNodeById({ nodeId, data });
    setTreeData(
      removeNodeAtPath({
        treeData,
        path: foundNode.path,
        getNodeKey,
        ignoreCollapsed: true,
      })
    );
  };

  const toggleNodeExpansion = expanded => {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded,
      })
    );
  };

  const expandNodeWithDescendantsAndSetEditable = ({ node }) => {
    let newUpdatedNodes = { ...updatedNodes };
    setTreeData(
      mapTree({
        treeData,
        callback: args => {
          if (args.node.id === node.id || isDescendant(node, args.node)) {
            newUpdatedNodes = {
              ...newUpdatedNodes,
              [args.node.id]: {
                ...(newUpdatedNodes[args.node.id] || {}),
                id: args.node.id,
                name: args.node.name,
              },
            };
            return { ...args.node, expanded: true };
          }
          return { ...args.node };
        },
        getNodeKey: ({ treeIndex }) => treeIndex,
        ignoreCollapsed: false,
      })
    );
    setUpdatedNodes(newUpdatedNodes);
  };

  const enableEditAll = () => {
    setUpdatedNodes({});
    toggleNodeExpansion(true);
    setEditAll(true);
  };

  const saveAll = async () => {
    const nodes = Object.values(updatedNodes);
    if (nodes && nodes.length) {
      const result = await saveNodes({ data: nodes });
      updateNodes(result.payload);
    }
    cancelSavingAll();
  };

  const cancelSavingAll = () => {
    setEditAll(false);
    setUpdatedNodes({});
  };

  const save = async node => {
    const nodes = Object.values(updatedNodes);
    let updatedNode = nodes.find(n => n.id === node.id);
    if (updatedNode) {
      const nodeId = parseInt(updatedNode.id, 10);
      const result = await saveNode({ nodeId, data: updatedNode });
      updateNode(result.payload);
    }
    cancelSave(node);
  };

  const cancelSave = node => {
    setEditAll(false);
    let newUpdatedNodes = { ...updatedNodes };
    delete newUpdatedNodes[node.id];
    setUpdatedNodes(newUpdatedNodes);
  };

  const getNodeValue = (name, defaultNode = {}) => {
    return (
      (updatedNodes[defaultNode.id] && updatedNodes[defaultNode.id][name]) || defaultNode[name]
    );
  };

  const handleChangeNode = (name, defaultNode) => event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setUpdatedNodes({
      ...updatedNodes,
      [defaultNode.id]: {
        ...(updatedNodes[defaultNode.id] || {}),
        id: defaultNode.id,
        [name]: value,
      },
    });
  };

  return {
    treeData,
    data,
    setTreeData,

    selectedNode,
    setSelectedNode,

    editAll,
    setEditAll,

    updatedNodes,
    setUpdatedNodes,

    toggleNodeExpansion,
    expandNodeWithDescendantsAndSetEditable,

    enableEditAll,
    saveAll,
    cancelSavingAll,

    save,
    cancelSave,

    findNodeById,
    addNode,
    getNodeValue,
    handleChangeNode,
    updateNode,
    updateNodes,
    removeNode,

    getNodeKey,
  };
};

export default useTree;
