import React from 'react';
import { FormModal } from 'lib/form';

import { getCompanyAction, deleteCompanyAction } from 'api/actions';

const CompanyDelete = props => {
  return (
    <FormModal
      title="Delete Company"
      query={[getCompanyAction]}
      action={[deleteCompanyAction]}
      btnSubmitLabel="Delete"
      {...props}
    >
      {({ values: doc }) => (
        <React.Fragment>
          <p>Are you sure you want to delete "{doc.name}"</p>
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default CompanyDelete;
