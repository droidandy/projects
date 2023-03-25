import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormCard } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { addGroupfilterAction } from 'api/actions';
import { addGroupfilterSchema } from 'schemas';

const GroupFilterAdd = props => {
  const match = useRouteMatch();
  let companyId = parseInt(match.params.companyId, 10);

  return (
    <FormCard
      action={[addGroupfilterAction]}
      validationSchema={addGroupfilterSchema}
      initialValues={{ companyId, parentId: null }}
      onComplete={props.onComplete}
      onCancel={props.onCancel}
      btnSubmitLabel="Add"
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="Name" />
        </React.Fragment>
      )}
    </FormCard>
  );
};

export default GroupFilterAdd;
