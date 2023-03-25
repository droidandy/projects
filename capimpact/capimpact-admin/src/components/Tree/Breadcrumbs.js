import React from 'react';

import './Breadcrumbs.scss';

const TreeBreadcrumbs = ({ selectedNode, data, onClick }) => {
  return selectedNode ? (
    <ul className="tree-breadcrumb">
      {selectedNode.path.map(nodeId => {
        const item = data.find(n => n.node.id === nodeId);
        return (
          item && (
            <li key={nodeId}>
              {nodeId === selectedNode.id ? (
                <a href={`#${nodeId}`} className="active" onClick={event => event.preventDefault()}>
                  {item.node.name}
                </a>
              ) : (
                <a
                  href={`#${nodeId}`}
                  onClick={event => {
                    event.preventDefault();
                    onClick({ ...item.node, path: item.path });
                  }}
                >
                  {item.node.name}
                </a>
              )}
            </li>
          )
        );
      })}
    </ul>
  ) : null;
};

export default TreeBreadcrumbs;
