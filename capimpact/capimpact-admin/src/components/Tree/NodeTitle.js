import React from 'react';
import classNames from 'classnames';

const TreeNodeTitle = ({
  node,
  selectedNode,
  selectable = true,
  selectNode,
  editNode,
  deleteNode,
  icons = [],
}) => {
  return (
    <div
      className={classNames('rst__Title', {
        active: selectedNode && selectedNode.id === node.id,
        unselectable: !selectable,
      })}
    >
      <div
        className="d-flex flex-row align-items-center justtify-content-start h-100 px-2 node-name"
        onClick={() => selectNode && selectable && selectNode(node)}
      >
        {icons.map((item, index) => (
          <i
            key={index}
            className={classNames('fa', 'mr-2', item.icon)}
            style={{ cursor: 'pointer' }}
            onClick={() => item.onClick(node)}
          />
        ))}
        {editNode && (
          <i
            className="fa fa-edit mr-2"
            style={{ cursor: 'pointer' }}
            onClick={() => editNode(node)}
          />
        )}
        {deleteNode && (
          <i
            className="fa fa-trash mr-2"
            style={{ cursor: 'pointer' }}
            onClick={() => deleteNode(node)}
          />
        )}
        <span>{node.name}</span>
      </div>
    </div>
  );
};

export default TreeNodeTitle;
