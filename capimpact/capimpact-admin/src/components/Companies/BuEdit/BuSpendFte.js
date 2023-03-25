import React, { useState } from 'react';
import compose from 'recompose/compose';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import classNames from 'classnames';
import { Form } from 'lib/form';
import { TextField } from 'lib/form/fields';
import { Button } from 'reactstrap';
import Select from 'react-select';
import withConfirm from 'lib/withConfirm';

import { getTreeCapabilitiesAction, saveCapabilitiesAction } from 'api/actions';

import classes from '../styles.module.scss';

const BuSpendFte = ({ company, caps = [], initialParent = {}, refetch, confirm }) => {
  const history = useHistory();
  const [parent, setParent] = useState(initialParent);
  const parents = caps.map(cap => ({ label: cap.name, value: cap.id }));
  const parentCap = caps.find(cap => cap.id === parent.value);
  const data =
    parentCap &&
    Array.from(parentCap.children).reduce(
      (o, cap) => ({
        ...o,
        [`${cap.id}_${cap.name}`]: {
          id: cap.id,
          name: cap.name,
          capitalCosts: cap.capitalCosts,
          fte: cap.fte,
          salaryCosts: cap.salaryCosts,
        },
      }),
      {}
    );

  return (
    <Form
      action={[saveCapabilitiesAction]}
      initialValues={{ data }}
      beforeSubmit={({ data }) =>
        Object.keys(data).map(key => {
          const [id] = key.split('_', 2);
          return {
            ...data[key],
            id: +id,
          };
        })
      }
      onSubmitSuccess={async () => {
        await refetch();
      }}
      enableReinitialize
    >
      {({ values, submitForm, dirty }) => {
        const goToView = () => history.push(`/companies/${company.id}/view`);
        const confirmUnsave = confirm(() => goToView(), {
          title: 'Done',
          description: 'Unsaved data will be lost, are you sure ?',
        });
        const done = dirty ? confirmUnsave : () => goToView();

        return (
          <div className={classNames(classes.buEditTableContainer)}>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-end">
                <div className="mr-3" style={{ width: 300 }}>
                  <label>Business Unit</label>
                  <Select
                    options={parents}
                    value={parent}
                    onChange={async value => {
                      if (dirty) {
                        confirmUnsave();
                      } else {
                        setParent(value);
                      }
                      //submitForm();
                    }}
                  />
                </div>
                <Button className="mr-3" type="button" color="primary" onClick={submitForm}>
                  Save
                </Button>
                <Button color="danger" onClick={done}>
                  Done
                </Button>
              </div>
              <div className="my-4">
                <div className="table-responsive">
                  <table className="table table-borderless form-group-m-none">
                    <thead>
                      <tr>
                        <th width="100"></th>
                        <th
                          colSpan="3"
                          style={{
                            borderBottom: '1px solid #ddd',
                            color: '#333',
                            fontSize: '1.4rem',
                          }}
                        >
                          Estimate per Month
                        </th>
                      </tr>
                      <tr>
                        <th width="100"></th>
                        <th>
                          Capital Costs
                          <br />
                          <small>(in ,000)</small>
                        </th>
                        <th>FTEs</th>
                        <th>
                          Salary Costs
                          <br />
                          <small>(in ,000)</small>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(data || {}).map(cap => (
                        <tr key={cap.id}>
                          <td className={classes.capName}>{cap.name}</td>
                          <td>
                            <TextField
                              name={`data.${cap.id}_${cap.name}.capitalCosts`}
                              type="number"
                              step="10"
                              min="0"
                              FormGroupProps={{ style: { margin: 0 } }}
                            />
                          </td>
                          <td>
                            <TextField
                              name={`data.${cap.id}_${cap.name}.fte`}
                              type="number"
                              step="1"
                              min="0"
                              FormGroupProps={{ style: { margin: 0 } }}
                            />
                          </td>
                          <td>
                            <TextField
                              name={`data.${cap.id}_${cap.name}.salaryCosts`}
                              type="number"
                              step="10"
                              min="0"
                              FormGroupProps={{ style: { margin: 0 } }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

const BuSpendFteContainer = ({ company, confirm }) => {
  const { loading, payload: tree = {}, query: refetch } = useQuery(
    getTreeCapabilitiesAction({ company_id: company.id })
  );
  const caps = tree && tree.children;
  const initialParent = (caps && caps.length && { label: caps[0].name, value: caps[0].id }) || null;

  return (
    !loading && (
      <BuSpendFte
        company={company}
        caps={caps}
        initialParent={initialParent}
        refetch={refetch}
        confirm={confirm}
      />
    )
  );
};

export default compose(withConfirm)(BuSpendFteContainer);
