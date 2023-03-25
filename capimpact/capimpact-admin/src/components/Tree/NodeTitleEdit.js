import React from 'react';
import { Button, Input } from 'reactstrap';

import './NodeTitleEdit.scss';

const TreeNodeTitleEdit = ({ node, editAll, value, onChange, save, cancel, deleteNode }) => {
  return (
    <div className="d-flex flex-row align-items-center justtify-content-start h-100 mx-2">
      <Input
        className="border-0 p-0 m-1 h-auto"
        type="text"
        name="name"
        value={value}
        onChange={onChange}
        onKeyDown={event => {
          if (!editAll) {
            if (event.key === 'Enter') {
              return save(node);
            } else if (event.key === 'Escape') {
              cancel(node);
            }
          }
        }}
        style={{ minWidth: 600 }}
      />
      {!editAll ? (
        <React.Fragment>
          <Button
            tag="a"
            className="px-1 mx-1 text-success"
            color="link"
            title="Save"
            onClick={() => save(node)}
          >
            <i className="fa fa-save" />
          </Button>
          <Button
            tag="a"
            className="px-1 mx-1 text-danger"
            color="link"
            title="Cancel"
            onClick={() => cancel(node)}
          >
            <i className="fa fa-times" />
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {deleteNode && (
            <Button
              tag="a"
              className="px-1 mx-1 text-danger"
              color="link"
              title="Remove"
              onClick={() => deleteNode(node)}
            >
              <i className="fa fa-trash" />
            </Button>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default TreeNodeTitleEdit;
