import React, { useState } from 'react';
import compose from 'recompose/compose';
import { Link, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import classNames from 'classnames';
import { Form } from 'lib/form';
import { MultipleSelectField } from 'lib/form/fields';
import { Button } from 'reactstrap';
import Select from 'react-select';
import withConfirm from 'lib/withConfirm';

import { getTreeCapabilitiesAction, saveCapabilitiesAction, getGrouptagsAction } from 'api/actions';

import { GroupTags } from 'components/GroupTags';

import classes from '../styles.module.scss';

const BuTags = ({
  company,
  caps = [],
  grouptags = [],
  initialParent = {},
  refetch,
  refetchGrouptags,
  confirm,
}) => {
  const match = useRouteMatch();
  const history = useHistory();
  const [parent, setParent] = useState(initialParent);
  const parents = caps.map(cap => ({ label: cap.name, value: cap.id }));
  const parentCap = caps.find(cap => cap.id === parent.value);
  const initialValues =
    parentCap &&
    Array.from(parentCap.children).reduce(
      (o, cap) => ({
        ...o,
        [`${cap.id}_${cap.name}`]: {
          id: cap.id,
          name: cap.name,
          tags: cap.tags,
        },
      }),
      {}
    );
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
        const widthColumn = `${100 / (grouptags.length + 1)}%`;

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
                <Button
                  tag={Link}
                  className="mr-3"
                  type="button"
                  color="primary"
                  to={`${match.url}/manage-tags`}
                >
                  Add/Edit Tags
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
                        <th style={{ width: widthColumn }}></th>
                        {grouptags.map(group => {
                          return (
                            <th key={group.id} style={{ width: widthColumn }}>
                              {group.name}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(values).map(cap => (
                        <tr key={cap.id}>
                          <td className={classes.capName} style={{ width: widthColumn }}>
                            {cap.name}
                          </td>
                          {grouptags.map(group => {
                            const options = Array.from(group.tags || []).map(tag => ({
                              label: tag,
                              value: tag,
                            }));
                            return (
                              <td key={group.id} style={{ width: widthColumn }}>
                                <MultipleSelectField
                                  name={`${cap.id}_${cap.name}.tags.${group.id}_${group.name}`}
                                  options={options}
                                  menuPortalTarget={document.body}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <Switch>
              <Route path={`${match.path}/manage-tags`}>
                <GroupTags
                  company={company}
                  onComplete={async () => {
                    await refetch();
                    await refetchGrouptags();
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

const BuTagsContainer = ({ company, confirm }) => {
  const { loading: loadingTreeCaps, payload: tree = {}, query: refetch } = useQuery(
    getTreeCapabilitiesAction({ company_id: company.id })
  );
  const { loading: loadingGrouptags, payload: grouptags = [], query: refetchGrouptags } = useQuery(
    getGrouptagsAction({ companyId: company.id })
  );
  const caps = tree && tree.children;
  const initialParent = (caps && caps.length && { label: caps[0].name, value: caps[0].id }) || null;

  const loading = loadingTreeCaps || loadingGrouptags;

  return (
    !loading && (
      <BuTags
        company={company}
        caps={caps}
        grouptags={grouptags}
        initialParent={initialParent}
        refetch={refetch}
        refetchGrouptags={refetchGrouptags}
        confirm={confirm}
      />
    )
  );
};

export default compose(withConfirm)(BuTagsContainer);
