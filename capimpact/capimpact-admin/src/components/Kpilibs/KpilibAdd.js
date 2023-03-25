import React from 'react';
import { FormModal } from 'lib/form';
import { TextField, SelectField, CheckboxField } from 'lib/form/fields';

import { addKpilibAction } from 'api/actions';
import { addKpilibSchema } from 'schemas';

import { benefitTypeOptions } from 'data/options';

const KpilibAdd = props => {
  return (
    <FormModal
      title="Add Kpilib"
      action={[addKpilibAction]}
      initialValues={{
        status: 'Revenue',
      }}
      validationSchema={addKpilibSchema}
      btnSubmitLabel="Add"
      {...props}
    >
      {() => (
        <React.Fragment>
          <TextField name="label" label="Label" />
          <TextField type="textarea" name="description" label="description" />
          {/*<TextField type="textarea" name="kpi" label="kpi" />
          <TagsField name="tags" label="tags" />*/}
          <TextField name="source" label="source" />
          <TextField type="number" name="min" label="Min" />
          <TextField type="number" name="max" label="Max" />
          <SelectField name="benefitType" label="Benefit" options={benefitTypeOptions} />
          <CheckboxField name="isActive" label="Is active" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default KpilibAdd;
