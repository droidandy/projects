import React from 'react';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { cloneIndustryAction } from 'api/actions';

import { addIndustrySchema } from 'schemas';

const IndustryClone = props => {
  return (
    <FormModal
      title="Clone Industry"
      action={[cloneIndustryAction]}
      validationSchema={addIndustrySchema}
      btnSubmitLabel="Clone"
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="New Industry Name" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default IndustryClone;
