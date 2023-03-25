import React from 'react';
import { useParams } from 'react-router-dom';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { addCapabilityAction } from 'api/actions';
import { addCapabilitySchema } from 'schemas';

const CapabilityAdd = props => {
  const params = useParams();
  let parentId = parseInt(params.parentId, 10);
  let industry_id = parseInt(params.industryId, 10);

  return (
    <FormModal
      title="Add Capability"
      action={[addCapabilityAction]}
      initialValues={{ parentId, industry_id }}
      validationSchema={addCapabilitySchema}
      btnSubmitLabel="Add"
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

export default CapabilityAdd;
