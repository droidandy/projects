import React from 'react';
import { useHistory } from 'react-router-dom';
//import { useQuery } from 'react-fetching-library';
import { FormModal } from 'lib/form';
import { TextField, SelectField } from 'lib/form/fields';
import { Button } from 'reactstrap';
import { object, string, number } from 'yup';

import { addCapabilityAction } from 'api/actions';

let schema = object({
  company_id: number().required(),
  nodeId: number(),
  nodeName: string().when('nodeId', {
    is: -1,
    then: string().required('Name is required'),
    otherwise: string(),
  }),
});

const AddBusinessUnit = ({ company, caps, parents, ...props }) => {
  let history = useHistory();
  //const { loading, payload: industries = [] } = useQuery(getIndustriesAction());

  return (
    <FormModal
      title="Add/Remove Business Unit"
      action={[addCapabilityAction]}
      initialValues={{ company_id: company.id }}
      //validationSchema={schema}
      onComplete={async (result, { setValues }) => {
        setValues(
          {
            nodeId: null,
            nodeName: null,
          },
          false
        );
      }}
      noButtons
      {...props}
    >
      {({ isSubmitting, submitForm, validateForm, isValid, values }) => {
        let data = caps.map(node => ({ id: node.id, name: node.name }));

        return (
          <React.Fragment>
            <SelectField
              name="nodeId"
              label="Select Business Unit"
              options={[{ label: 'Add Custom Business Unit', value: -1 }].concat([])}
            />
            {values.nodeId === -1 && <TextField name="nodeName" label="Business Unit Name" />}
            <div className="text-right">
              <Button color="link" onClick={() => history.goBack()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="button"
                color="primary"
                onClick={validateForm}
                disabled={isSubmitting}
                outline
              >
                {isSubmitting ? <i className="fas fa-spinner fa-spin" /> : <span>Add</span>}
              </Button>
            </div>
            <h4 className="mt-3 mb-2">Remove Business Units</h4>
            {data.map(node => (
              <div key={node.id} className="d-flex align-items-center mb-2">
                <div className="mr-auto">{node.name}</div>
                <Button
                  color="danger"
                  onClick={() => console.log(`del ${node.id}`)}
                  disabled={isSubmitting}
                  outline
                >
                  Delete
                </Button>
              </div>
            ))}
          </React.Fragment>
        );
      }}
    </FormModal>
  );
};

export default AddBusinessUnit;
