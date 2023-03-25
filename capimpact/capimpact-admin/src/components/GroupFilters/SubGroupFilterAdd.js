import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormCard } from 'lib/form';
import { TextField, TagsField } from 'lib/form/fields';

import { addGroupfilterAction } from 'api/actions';
import { addSubGroupfilterSchema } from 'schemas';

const SubGroupFilterAdd = props => {
  const match = useRouteMatch();
  let companyId = parseInt(match.params.companyId, 10);
  let parentId = parseInt(match.params.parentId, 10) || null;

  return (
    <FormCard
      action={[addGroupfilterAction]}
      validationSchema={addSubGroupfilterSchema}
      initialValues={{ companyId, parentId }}
      onComplete={props.onComplete}
      onCancel={props.onCancel}
      btnSubmitLabel="Add"
    >
      {() => (
        <React.Fragment>
          <TextField name="name" label="Name" />
          <TagsField name="filters" label="Filters" />
        </React.Fragment>
      )}
    </FormCard>
  );
};

export default SubGroupFilterAdd;
