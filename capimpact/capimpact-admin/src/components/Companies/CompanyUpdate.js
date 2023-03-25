import React from 'react';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { getCompanyAction, saveCompanyAction } from 'api/actions';
import { updateCompanySchema } from 'schemas';

const CompanyUpdate = props => {
  return (
    <FormModal
      title="Update Company"
      query={[getCompanyAction]}
      action={[saveCompanyAction]}
      validationSchema={updateCompanySchema}
      btnSubmitLabel="Save"
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="Company Name" />
          <TextField name="cid" label="Company CID" placeholder="Optional" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default CompanyUpdate;
