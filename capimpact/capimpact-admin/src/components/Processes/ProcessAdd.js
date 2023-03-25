import React from 'react';
import { useParams } from 'react-router-dom';
import { FormModal } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { addProcessAction } from 'api/actions';
import { addProcessSchema } from 'schemas';

//import { colourOptions } from 'data/options';

const ProcessAdd = ({ onComplete }) => {
  const params = useParams();
  let parentId = parseInt(params.parentId, 10);
  let industry_id = parseInt(params.industryId, 10);

  return (
    <FormModal
      title="Add Process"
      action={[addProcessAction]}
      initialValues={{ parentId, industry_id }}
      validationSchema={addProcessSchema}
      onComplete={onComplete}
      btnSubmitLabel="Add"
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="Process Name" />
          {/*<CheckboxesField name="color" label="Process Color" options={colourOptions} />*/}
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default ProcessAdd;
