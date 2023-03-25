import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { cloneCompanyAction } from 'api/actions';

import { updateCompanySchema } from 'schemas';

const CompanyClone = props => {
  const match = useRouteMatch();
  const { companyId } = match.params;

  return (
    <FormModal
      title="Clone Company"
      action={[cloneCompanyAction]}
      validationSchema={updateCompanySchema}
      btnSubmitLabel="Clone"
      initialValues={{ id: +companyId }}
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="New Company Name" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default CompanyClone;
