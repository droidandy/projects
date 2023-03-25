import React from 'react';
import { FormModal } from 'lib/form';

import { getValueDriverAction, deleteValueDriverAction } from 'api/actions';

const ValueDriverDelete = ({ onComplete }) => {
  return (
    <FormModal
      title="Delete ValueDriver"
      query={[getValueDriverAction]}
      action={[deleteValueDriverAction]}
      onComplete={onComplete}
      btnSubmitLabel="Delete"
    >
      {({ values: doc }) => (
        <React.Fragment>
          <p>Are you sure you want to delete "{doc.name}"</p>
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default ValueDriverDelete;
