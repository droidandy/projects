import React from 'react';
import { useParams } from 'react-router-dom';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { addValueDriverAction } from 'api/actions';
import { addValueDriverSchema } from 'schemas';

const ValueDriverAdd = props => {
  const params = useParams();
  let parentId = parseInt(params.parentId, 10);
  let industryId = parseInt(params.industryId, 10);

  return (
    <FormModal
      title="Add ValueDriver"
      action={[addValueDriverAction]}
      initialValues={{ parentId, industryId }}
      validationSchema={addValueDriverSchema}
      btnSubmitLabel="Add"
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

export default ValueDriverAdd;
