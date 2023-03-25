import React from 'react';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { addIndustryAction } from 'api/actions';

import { addIndustrySchema } from 'schemas';

const IndustryAdd = props => {
  return (
    <FormModal
      title="Add Industry"
      action={[addIndustryAction]}
      validationSchema={addIndustrySchema}
      btnSubmitLabel="Add"
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="Industry Name" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default IndustryAdd;
