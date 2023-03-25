import React from 'react';
import { Form } from 'lib/form';
import { TextField, TagsField } from 'lib/form/fields';

import { addGrouptagAction } from 'api/actions';
import { addGrouptagSchema } from 'schemas';

import { Button } from 'reactstrap';

const GroupTagAdd = props => {
  return (
    <Form
      action={[addGrouptagAction]}
      validationSchema={addGrouptagSchema}
      initialValues={props.initialValues}
      onSubmitSuccess={props.onSubmitSuccess}
    >
      {({ isSubmitting, submitForm }) => (
        <React.Fragment>
          <TextField name="name" label="Name" />
          <TagsField name="tags" label="Tags" />
          <div>
            <Button type="button" color="primary" onClick={submitForm} disabled={isSubmitting}>
              {isSubmitting ? <i className="fas fa-spinner fa-spin" /> : <span>Add</span>}
            </Button>
          </div>
        </React.Fragment>
      )}
    </Form>
  );
};

export default GroupTagAdd;
