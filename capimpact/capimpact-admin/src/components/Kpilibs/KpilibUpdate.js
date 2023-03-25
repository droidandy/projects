import React from 'react';
import { FormModal } from 'lib/form';
import { TextField, SelectField, CheckboxField, CheckboxesField } from 'lib/form/fields';

import { getKpilibAction, saveKpilibAction } from 'api/actions';
import { updateKpilibSchema } from 'schemas';

import { benefitTypeOptions, kpiTypesOptions } from 'data/options';

const KpilibUpdate = props => {
  return (
    <FormModal
      title="Update Kpilib"
      query={[getKpilibAction]}
      action={[saveKpilibAction]}
      validationSchema={updateKpilibSchema}
      btnSubmitLabel="Save"
      {...props}
    >
      {({ values }) => (
        <React.Fragment>
          <TextField name="label" label="Label" />
          <TextField type="textarea" name="description" label="description" />
          {/*<TextField type="textarea" name="kpi" label="kpi" />
          <TagsField name="tags" label="tags" />*/}
          <TextField name="source" label="source" />
          <CheckboxesField name="types" label="Types" options={kpiTypesOptions} />
          <TextField type="number" name="min" label="Min" />
          <TextField type="number" name="max" label="Max" />
          <SelectField name="benefitType" label="Benefit" options={benefitTypeOptions} />
          <CheckboxField name="isActive" label="Is active" />
        </React.Fragment>
      )}
    </FormModal>
  );
};

export default KpilibUpdate;
