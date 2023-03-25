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
  parentId: string().required(),
  nodeId: string().required(),
  nodeName: string().when('nodeId', {
    is: -1,
    then: string().required(),
    otherwise: string(),
  }),
});

const AddCapabilities = ({ company, caps, parents, parentId, ...props }) => {
  let history = useHistory();
  //const { loading, payload: industries = [] } = useQuery(getIndustriesAction());

  return (
    <FormModal
      title="Add/Remove Capabilities"
      action={[addCapabilityAction]}
      initialValues={{ parentId, company_id: company.id }}
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
        let data = [];
        if (values.parentId && values.parentId !== -1) {
          const parentCap = caps.find(cap => cap.id === values.parentId);
          data = parentCap.children || [];
        }

        return (
          <React.Fragment>
            <SelectField name="parentId" label="Select Business Unit" options={parents} />
            <SelectField
              name="nodeId"
              label="Capability"
              options={[{ label: 'Add Custom Business Unit', value: -1 }].concat([])}
            />
            {values.nodeId === -1 && <TextField name="nodeName" label="Capability Name" />}
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
            <h4 className="mt-3 mb-2">Remove Capability</h4>
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

export default AddCapabilities;
