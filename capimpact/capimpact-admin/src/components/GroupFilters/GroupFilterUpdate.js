import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useMutation } from 'react-fetching-library';
import { FormCard } from 'lib/form';
import { TextField, TagsField } from 'lib/form/fields';

import { getGroupfilterAction, saveGroupfilterAction, deleteGroupfilterAction } from 'api/actions';
import { updateGroupfilterSchema } from 'schemas';

import { Button } from 'reactstrap';

const GroupFilterUpdate = props => {
  const match = useRouteMatch();
  const { groupfilterId } = match.params;
  const { loading: removing, mutate: remove } = useMutation(deleteGroupfilterAction);

  return (
    <FormCard
      query={[getGroupfilterAction]}
      action={[saveGroupfilterAction]}
      validationSchema={updateGroupfilterSchema}
      onComplete={props.onComplete}
      onCancel={props.onCancel}
      btnSubmitLabel="Save"
      noButtons
    >
      {({ values, submitForm, isSubmitting }) => (
        <React.Fragment>
          <TextField name="name" label="Name" />
          {values.parentId && <TagsField name="filters" label="Filters" />}
          <div className="d-flex justify-content-between">
            <Button
              type="button"
              color="primary"
              onClick={submitForm}
              disabled={isSubmitting || removing}
            >
              {isSubmitting ? <i className="fas fa-spinner fa-spin" /> : <span>Save</span>}
            </Button>
            <Button
              type="button"
              color="danger"
              onClick={async () => {
                await remove({ groupfilterId });
                await props.onDeleted(groupfilterId);
              }}
              disabled={isSubmitting || removing}
            >
              {removing ? <i className="fas fa-spinner fa-spin" /> : <span>Delete</span>}
            </Button>
          </div>
        </React.Fragment>
      )}
    </FormCard>
  );
};

export default GroupFilterUpdate;
