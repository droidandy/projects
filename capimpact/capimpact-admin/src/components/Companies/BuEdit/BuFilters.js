import React from 'react';
import compose from 'recompose/compose';
import { Link, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import classNames from 'classnames';
import { Form } from 'lib/form';
import { SelectField } from 'lib/form/fields';
import { Button } from 'reactstrap';
import Select from 'react-select';
import withConfirm from 'lib/withConfirm';
import { getTreeFromFlatData } from 'react-sortable-tree';
import _ from 'lodash';

import {
  getTreeCapabilitiesAction,
  saveCapabilitiesAction,
  getGroupfiltersAction,
} from 'api/actions';

import { GroupFilters } from 'components/GroupFilters';

import classes from '../styles.module.scss';

const BuFilters = ({
  company,
  caps = [],
  groupfilters = [],
  parents = [],
  parentId,
  parent,
  initialValues = {},
  refetch,
  refetchGroupfilters,
  confirm,
}) => {
  const match = useRouteMatch();
  const history = useHistory();
  const beforeSubmit = data =>
    Object.keys(data).map(key => {
      const [id] = key.split('_', 2);
      return {
        ...data[key],
        id: +id,
      };
    });

  return (
    <Form
      action={[saveCapabilitiesAction]}
      initialValues={initialValues}
      beforeSubmit={beforeSubmit}
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
        const capabilities = _.orderBy(Object.values(values), ['name'], ['asc']);

        return (
          <div className={classNames(classes.buEditTableContainer)}>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-end">
                <div className="mr-3" style={{ width: 300 }}>
                  <label>Business Unit</label>
                  <Select
                    options={parents}
                    value={parents.find(p => p.value === parentId)}
                    onChange={async value => {
                      if (dirty) {
                        confirmUnsave();
                      } else {
                        history.push(`/companies/${company.id}/edit/filters/${value.value}`);
                      }
                    }}
                  />
                </div>
                <Button
                  tag={Link}
                  className="mr-3"
                  type="button"
                  color="primary"
                  to={`${match.url}/manage-filters`}
                >
                  Add/Edit Filters
                </Button>
                <Button className="mr-3" type="button" color="primary" onClick={submitForm}>
                  Save
                </Button>
                <Button color="danger" onClick={done}>
                  Done
                </Button>
              </div>
              <div className="my-4">
                <div className="table-responsive">
                  <table className="table table-borderless form-group-m-none bu-tags">
                    <thead>
                      <tr>
                        <th></th>
                        {groupfilters.map(group => {
                          const children = group.children || [];
                          return (
                            <th colSpan={children.length} key={group.id}>
                              <div style={{ borderBottom: '1px solid #ccc' }}>{group.name}</div>
                            </th>
                          );
                        })}
                      </tr>
                      <tr>
                        <th></th>
                        {groupfilters.map(group => {
                          const children = group.children || [];
                          return children.map(subgroup => (
                            <th key={subgroup.id}>{subgroup.name}</th>
                          ));
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {capabilities.map(cap => (
                        <tr key={cap.id}>
                          <td className={classes.capName}>{cap.name}</td>
                          {groupfilters.map(group => {
                            const children = group.children || [];
                            return children.map(subgroup => {
                              const options = Array.from(subgroup.filters || []).map(filter => ({
                                label: filter,
                                value: filter,
                              }));
                              return (
                                <td key={subgroup.id}>
                                  <SelectField
                                    name={`${cap.id}_${cap.name}.filters.${group.id}_${group.name}.${subgroup.id}_${subgroup.name}`}
                                    options={options}
                                    menuPortalTarget={document.body}
                                    isClearable
                                  />
                                </td>
                              );
                            });
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Switch>
              <Route path={`${match.path}/manage-filters`}>
                <GroupFilters
                  company={company}
                  onComplete={async () => {
                    await refetch();
                    await refetchGroupfilters();
                  }}
                />
              </Route>
            </Switch>
          </div>
        );
      }}
    </Form>
  );
};

const BuFiltersContainer = ({ company, confirm }) => {
  const match = useRouteMatch();
  console.log(match.params);
  const { loading: loadingTreeCaps, payload: tree = {}, query: refetch } = useQuery(
    getTreeCapabilitiesAction({ company_id: company.id })
  );
  let {
    loading: loadingGroupfilters,
    payload: groupfilters = [],
    query: refetchGroupfilters,
  } = useQuery(getGroupfiltersAction({ companyId: company.id }));
  const caps = tree && tree.children;
  const parentId = parseInt(
    match.params.parentId ||
      (caps && caps.length && { label: caps[0].name, value: caps[0].id }) ||
      0,
    10
  );
  const parents = caps && caps.map(cap => ({ label: cap.name, value: cap.id }));
  const parent = caps && caps.find(cap => cap.id === parentId);
  const initialValues =
    parent &&
    Array.from(parent.children).reduce(
      (o, cap) => ({
        ...o,
        [`${cap.id}_${cap.name}`]: {
          id: cap.id,
          name: cap.name,
          filters: cap.filters,
        },
      }),
      {}
    );

  const loading = loadingTreeCaps || loadingGroupfilters;

  if (!loading) {
    groupfilters = getTreeFromFlatData({
      flatData: groupfilters,
      getKey: node => node.id,
      getParentKey: node => node.parentId,
      rootKey: null,
    });
  }

  return (
    !loading && (
      <BuFilters
        company={company}
        caps={caps}
        groupfilters={groupfilters}
        parentId={parentId}
        parent={parent}
        parents={parents}
        initialValues={initialValues}
        refetch={refetch}
        refetchGroupfilters={refetchGroupfilters}
        confirm={confirm}
      />
    )
  );
};

export default compose(withConfirm)(BuFiltersContainer);
