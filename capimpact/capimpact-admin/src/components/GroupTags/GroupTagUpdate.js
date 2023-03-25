import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useMutation } from 'react-fetching-library';
import { Form } from 'lib/form';
import { TextField, TagsField } from 'lib/form/fields';

import { getGrouptagAction, saveGrouptagAction, deleteGrouptagAction } from 'api/actions';
import { updateGrouptagSchema } from 'schemas';

import { Button } from 'reactstrap';

const GroupTagUpdate = ({ onSubmitSuccess, onDeleted }) => {
  const match = useRouteMatch();
  const { grouptagId } = match.params;
  const { loading: removing, mutate: remove } = useMutation(deleteGrouptagAction);

  return (
    <Form
      query={[getGrouptagAction]}
      action={[saveGrouptagAction]}
      validationSchema={updateGrouptagSchema}
      onSubmitSuccess={onSubmitSuccess}
    >
      {({ values, submitForm, isSubmitting }) => (
        <React.Fragment>
          <TextField name="name" label="Name" />
          <TagsField name="tags" label="Tags" />
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
                await remove({ grouptagId });
                await onDeleted(grouptagId);
              }}
              disabled={isSubmitting || removing}
            >
              {removing ? <i className="fas fa-spinner fa-spin" /> : <span>Delete</span>}
            </Button>
          </div>
        </React.Fragment>
      )}
    </Form>
  );
};

export default GroupTagUpdate;
