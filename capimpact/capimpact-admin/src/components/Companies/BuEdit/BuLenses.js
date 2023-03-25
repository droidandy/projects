import React, { useState } from 'react';
import compose from 'recompose/compose';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import classNames from 'classnames';
import Select from 'react-select';
import { find } from 'lodash';

import { Form } from 'lib/form';
import { SelectField } from 'lib/form/fields';
import withConfirm from 'lib/withConfirm';

import { Button } from 'reactstrap';

import {
  getTreeCapabilitiesAction,
  getCapabilitiesByIdsAction,
  getLenses,
  saveCapabilitiesAction,
} from 'api/actions';

import Spinner from 'components/Spinner';

import classes from '../styles.module.scss';

const BuLenses = ({ company, caps, initialParent = {}, confirm }) => {
  const history = useHistory();
  const parents = caps.map(cap => ({ label: cap.name, value: cap.id }));
  const [parent, setParent] = useState(initialParent);
  const parentCap = caps.find(cap => cap.id === parent.value);
  const capabilityIds = (parentCap ? parentCap.children : []).map(d => d.id);
  const { loading: lenseLoading, payload: lenses = [] } = useQuery(getLenses());
  const { loading: capLoading, payload: capabilities = [], query: refetchCapabilities } = useQuery(
    getCapabilitiesByIdsAction({ ids: capabilityIds })
  );
  const loading = lenseLoading || capLoading;
  const initialValues = capabilities.reduce((prev, cap) => {
    const classifications = lenses.reduce((o, d) => {
      const classification = find(cap.classifications, c => c.lense.name === d.name);
      return {
        ...o,
        [`${d.id}_${d.name}`]: classification ? classification.id : -1,
      };
    }, {});
    return {
      ...prev,
      [cap.name]: {
        id: cap.id,
        name: cap.name,
        classifications,
      },
    };
  }, {});

  const goToView = () => history.push(`/companies/${company.id}/view`);

  const beforeSubmit = data => {
    return Object.values(data).map(d => ({
      ...d,
      classifications: Object.keys(d.classifications)
        .filter(lense => d.classifications[lense] !== -1)
        .map(lense => {
          const [lense_id] = lense.split('_', 2);
          return {
            id: d.classifications[lense],
            lense_id: +lense_id,
          };
        }),
    }));
  };

  return loading ? (
    <Spinner />
  ) : (
    <div className={classNames(classes.buEditTableContainer)}>
      <Form
        action={[saveCapabilitiesAction]}
        initialValues={initialValues}
        beforeSubmit={beforeSubmit}
        onSubmitSuccess={() => refetchCapabilities()}
        enableReinitialize
      >
        {({ values, submitForm, dirty }) => {
          const confirmUnsave = confirm(() => goToView(), {
            title: 'Done',
            description: 'Unsaved data will be lost, are you sure ?',
          });
          const onDone = dirty ? confirmUnsave : () => goToView();

          return (
            <div className="d-flex flex-column">
              <div className="d-flex align-items-end">
                <div className="mr-3" style={{ width: 300 }}>
                  <label>Business Unit</label>
                  <Select options={parents} value={parent} onChange={setParent} />
                </div>
                <Button className="mr-3" type="button" color="primary" onClick={submitForm}>
                  Save
                </Button>
                <Button color="danger" onClick={onDone}>
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
                          colSpan={lenses.length}
                          style={{
                            borderBottom: '1px solid #ddd',
                            color: '#333',
                            fontSize: '1.4rem',
                          }}
                        >
                          Lenses
                        </th>
                      </tr>
                      <tr>
                        <th width="100"></th>
                        {lenses.map(lense => {
                          return <th key={lense.id}>{lense.name}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(values).map(cap => {
                        return (
                          <tr key={cap.id}>
                            <td className={classes.capName}>{cap.name}</td>
                            {lenses.map(lense => {
                              return (
                                <td key={lense.id}>
                                  <SelectField
                                    name={`${cap.name}.classifications.${lense.id}_${lense.name}`}
                                    options={[{ label: `Select ${lense.name}`, value: -1 }].concat(
                                      lense.classifications.map(d => ({
                                        label: d.name,
                                        value: d.id,
                                      }))
                                    )}
                                    menuPortalTarget={document.body}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

const BuLensesContainer = ({ company, confirm }) => {
  const { loading, payload: tree = {}, query: refetch } = useQuery(
    getTreeCapabilitiesAction({ company_id: company.id })
  );
  const caps = tree && tree.children;
  const initialParent = (caps && caps.length && { label: caps[0].name, value: caps[0].id }) || null;

  return (
    !loading && (
      <BuLenses
        company={company}
        caps={caps}
        initialParent={initialParent}
        refetch={refetch}
        confirm={confirm}
      />
    )
  );
};

export default compose(withConfirm)(BuLensesContainer);
