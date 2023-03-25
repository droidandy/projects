import React, { useState } from 'react';
import { Switch, Route, Link, useParams, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { Button } from 'reactstrap';
import ShowMoreText from 'react-show-more-text';
// import _ from 'lodash';

import { getKpilibsAction, getCountKpilibsAction } from 'api/actions';

import { Table } from 'components/Table';

import { KpilibAdd, KpilibUpdate, KpilibDelete } from 'components/Kpilibs';

const KpilibsTable = () => {
  const match = useRouteMatch();
  const { industryId } = useParams();
  const { loading, payload } = useQuery(getCountKpilibsAction({ industryId }));
  let [queryResponse, setQueryResponse] = useState(null);

  return (
    !loading && (
      <React.Fragment>
        <Table
          className="kpilibs-table"
          height={700}
          action={getKpilibsAction}
          setQueryResponse={setQueryResponse}
          initialVariables={{ sorted: [{ id: 'label', desc: true }], pageSize: 50 }}
          variables={{ industryId }}
          totalRecords={payload.total}
          columns={[
            {
              Header: 'Actions',
              accessor: 'id',
              width: 150,
              Cell: ({ value: id }) => {
                return (
                  <div>
                    <Button
                      key="update"
                      tag={Link}
                      color="link"
                      title="Edit"
                      to={`${match.url}/${id}/update`}
                    >
                      <i className="fa fa-edit" />
                    </Button>
                    <Button
                      key="delete"
                      tag={Link}
                      className="text-danger"
                      color="link"
                      title="Delete"
                      to={`${match.url}/${id}/delete`}
                    >
                      <i className="fa fa-trash" />
                    </Button>
                  </div>
                );
              },
            },
            {
              Header: 'Label',
              accessor: 'label',
              width: 150,
            },
            {
              Header: 'Min',
              accessor: 'min',
              width: 150,
            },
            {
              Header: 'Max',
              accessor: 'max',
              width: 150,
            },
            {
              Header: 'Types',
              accessor: 'types',
              Cell: ({ value: types }) => Array.from(types || []).join(', '),
            },
            /*
            {
              Header: 'KPI',
              accessor: 'kpi',
            },
            {
              Header: 'Tags',
              accessor: 'tags',
              Cell: ({ value: tags }) => Array.from(tags || []).join(', '),
            },
            */
            {
              Header: 'Source',
              accessor: 'source',
            },
            {
              Header: 'Benefit',
              accessor: 'benefitType',
            },
            {
              Header: 'Active',
              accessor: 'isActive',
              Cell: ({ value: isActive }) => (isActive ? 'Yes' : 'No'),
            },
            {
              Header: 'Description',
              accessor: 'description',
              width: 300,
              Cell: ({ value: description, ...all }) => (
                <ShowMoreText lines={2}>{description || ''}</ShowMoreText>
              ),
            },
          ]}
          actions={[
            <Button key="add" tag={Link} color="primary" to={`${match.url}/add`}>
              <i className="fa fa-plus" /> Add KPI
            </Button>,
          ]}
        />
        <Switch>
          <Route path={`${match.path}/add`}>
            <KpilibAdd onComplete={async () => await queryResponse.query()} />
          </Route>
          <Route path={`${match.path}/:kpilibId/update`}>
            <KpilibUpdate onComplete={async () => await queryResponse.query()} />
          </Route>
          <Route path={`${match.path}/:kpilibId/delete`}>
            <KpilibDelete onComplete={async () => await queryResponse.query()} />
          </Route>
        </Switch>
      </React.Fragment>
    )
  );
};

export default KpilibsTable;
