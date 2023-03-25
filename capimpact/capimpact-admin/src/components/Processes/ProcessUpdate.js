import React from 'react';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { getProcessAction, saveProcessAction } from 'api/actions';
import { updateProcessSchema } from 'schemas';

const ProcessUpdate = props => {
  return (
    <FormModal
      title="Update Process"
      query={[getProcessAction]}
      action={[saveProcessAction]}
      validationSchema={updateProcessSchema}
      btnSubmitLabel="Save"
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="Process Name" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default ProcessUpdate;
