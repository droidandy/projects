import React from 'react';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { getValueDriverAction, saveValueDriverAction } from 'api/actions';
import { updateValueDriverSchema } from 'schemas';

const ValueDriverUpdate = props => {
  return (
    <FormModal
      title="Update ValueDriver"
      query={[getValueDriverAction]}
      action={[saveValueDriverAction]}
      validationSchema={updateValueDriverSchema}
      btnSubmitLabel="Save"
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="ValueDriver Name" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default ValueDriverUpdate;
