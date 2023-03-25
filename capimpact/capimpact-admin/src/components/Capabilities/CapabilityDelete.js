import React from 'react';
import { FormModal } from 'lib/form';

import { getCapabilityAction, deleteCapabilityAction } from 'api/actions';

const CapabilityDelete = ({ onComplete }) => {
  return (
    <FormModal
      title="Delete Capability"
      query={[getCapabilityAction]}
      action={[deleteCapabilityAction]}
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

export default CapabilityDelete;
