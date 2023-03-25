import React from 'react';
import { FormModal } from 'lib/form';

import { getProcessAction, deleteProcessAction } from 'api/actions';

const ProcessDelete = ({ onComplete }) => {
  return (
    <FormModal
      title="Delete Process"
      query={[getProcessAction]}
      action={[deleteProcessAction]}
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

export default ProcessDelete;
