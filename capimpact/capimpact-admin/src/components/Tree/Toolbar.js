import React from 'react';
import { Button } from 'reactstrap';

import classes from './Toolbar.module.css';

const TreeToolbar = ({
  selectedNode,
  isNodeSelected = false,
  isSaving = false,
  expandAll,
  collapseAll,
  addSibling,
  addChild,
  saveAll,
  cancelSavingAll,
  enableEditAll,
  maxLevels = -1,
}) => {
  return (
    <div className={classes.toolbar}>
      {expandAll && (
        <Button className={classes.button} type="button" color="primary" onClick={expandAll}>
          Expand all
        </Button>
      )}
      {collapseAll && (
        <Button className={classes.button} type="button" color="primary" onClick={collapseAll}>
          Collapse all
        </Button>
      )}
      {addSibling && (
        <Button
          className={classes.button}
          type="button"
          color="primary"
          onClick={addSibling}
          //disabled={!isNodeSelected}
        >
          Add Sibling
        </Button>
      )}
      {addChild && (
        <Button
          className={classes.button}
          type="button"
          color="primary"
          onClick={addChild}
          disabled={!isNodeSelected || (maxLevels > 0 && selectedNode.path.length >= maxLevels)}
        >
          Add Child
        </Button>
      )}
      {isSaving ? (
        <React.Fragment>
          {saveAll && (
            <Button className={classes.button} type="button" color="warning" onClick={saveAll}>
              Save
            </Button>
          )}
          {cancelSavingAll && (
            <Button color="link" onClick={cancelSavingAll}>
              Cancel
            </Button>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {enableEditAll && (
            <Button
              className={classes.button}
              type="button"
              color="warning"
              onClick={enableEditAll}
            >
              Edit All
            </Button>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default TreeToolbar;
