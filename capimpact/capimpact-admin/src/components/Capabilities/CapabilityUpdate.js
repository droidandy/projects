import React from 'react';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { getCapabilityAction, saveCapabilityAction } from 'api/actions';
import { updateCapabilitySchema } from 'schemas';

const CapabilityUpdate = props => {
  return (
    <FormModal
      title="Update Capability"
      query={[getCapabilityAction]}
      action={[saveCapabilityAction]}
      validationSchema={updateCapabilitySchema}
      btnSubmitLabel="Save"
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="Capability Name" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default CapabilityUpdate;
