import React from 'react';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { getIndustryAction, saveIndustryAction } from 'api/actions';

import { updateIndustrySchema } from 'schemas';

const IndustryUpdate = props => {
  return (
    <FormModal
      title="Rename Industry"
      query={[getIndustryAction]}
      action={[saveIndustryAction]}
      validationSchema={updateIndustrySchema}
      btnSubmitLabel="Save"
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

export default IndustryUpdate;
