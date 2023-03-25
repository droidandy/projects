import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { FormModal } from 'lib/form';
import { TextField, SelectField } from 'lib/form/fields';

import { addCompanyAction, getIndustriesAction } from 'api/actions';
import { addCompanySchema } from 'schemas';

const CompanyAdd = props => {
  const match = useRouteMatch();
  const { loading, payload: industries = [] } = useQuery(getIndustriesAction());
  const { industryId } = match.params;

  return (
    !loading && (
      <FormModal
        title="Add Company"
        action={[addCompanyAction]}
        initialValues={{
          industry_id: industryId ? +industryId : null,
        }}
        validationSchema={addCompanySchema}
        btnSubmitLabel="Add"
        {...props}
      >
        {() => (
          <React.Fragment>
            <SelectField
              name="industry_id"
              label="Industry"
              options={industries.map(({ id, name }) => ({ value: id, label: name }))}
            />
            <TextField name="name" label="Company Name" placeholder="Your Company" />
            <TextField name="cid" label="Company CID" placeholder="Optional" />
          </React.Fragment>
        )}
      </FormModal>
    )
  );
};

export default CompanyAdd;
