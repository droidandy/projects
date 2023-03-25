import React from 'react';
import { Switch, Route, Link, useParams, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-fetching-library';
import { Button } from 'reactstrap';
import ShowMoreText from 'react-show-more-text';

import { getStartUpsAction, getCountStartUpsAction } from 'api/actions';

import { Table } from 'components/Table';

import StartUpsTagCaps from './StartUpsTagCaps';

const StartUpsTable = () => {
  const match = useRouteMatch();
  const { industryId } = useParams();
  const { loading, payload } = useQuery(getCountStartUpsAction({ industryId }));

  return (
    !loading && (
      <React.Fragment>
        <Switch>
          <Route path={`${match.path}/:startupId/tag-caps`}>
            <StartUpsTagCaps />
          </Route>
          <Route path={match.path}>
            <Table
              className="startups-table"
              height={580}
              action={getStartUpsAction}
              resolveData={data => {
                return data.map(row => {
                  return {
                    ...row,
                    id: row.cid,
                  };
                });
              }}
              initialVariables={{ pageSize: 50, sorted: [{ id: 'name', desc: false }] }}
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
                          key="tag-caps"
                          tag={Link}
                          color="link"
                          title="Tag Caps"
                          to={`${match.url}/${id}/tag-caps`}
                        >
                          <i className="fa fa-tags" />
                        </Button>
                        {/*<Button
                          key="clone"
                          tag={Link}
                          color="link"
                          title="Clone"
                          to={`${match.url}/${id}/clone`}
                        >
                          <i className="fa fa-copy" />
                        </Button>*/}
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
                  Header: 'ID',
                  accessor: 'cid',
                },
                {
                  Header: 'Name',
                  accessor: 'name',
                  width: 150,
                },
                {
                  Header: 'Capabilities',
                  accessor: 'capabilities',
                  width: 250,
                  Cell: ({ value: capabilities }) => {
                    return Array.from(capabilities || [])
                      .map(cap => cap.name)
                      .join(', ');
                  },
                },
                {
                  Header: 'First Financing Date',
                  accessor: 'first_financing_date',
                  width: 150,
                },
                {
                  Header: 'First Financing Size',
                  accessor: 'first_financing_size',
                  width: 150,
                },
                {
                  Header: 'Last Financing Date',
                  accessor: 'last_financing_date',
                  width: 150,
                },
                {
                  Header: 'Last Financing Size',
                  accessor: 'last_financing_size',
                  width: 150,
                },
                {
                  Header: 'Revenue',
                  accessor: 'revenue',
                  width: 150,
                },
                {
                  Header: 'Year Founded',
                  accessor: 'year_founded',
                  width: 150,
                },
                {
                  Header: 'Description',
                  accessor: 'description',
                  width: 500,
                  Cell: ({ value: description }) => (
                    <ShowMoreText lines={2}>{description || ''}</ShowMoreText>
                  ),
                },
              ]}
              actions={[]}
            />
          </Route>
        </Switch>
        <Switch>
          <Route path={`${match.path}/add`}>
            <h3>add start up</h3>
          </Route>
          <Route path={`${match.path}/:startupId/clone`}>
            <h3>clone start up</h3>
          </Route>
          <Route path={`${match.path}/:startupId/update`}>
            <h3>update start up</h3>
          </Route>
          <Route path={`${match.path}/:startupId/delete`}>
            <h3>delete start up</h3>
          </Route>
        </Switch>
      </React.Fragment>
    )
  );
};

export default StartUpsTable;

/*
                <div
                  style={
                    {
                      position: 'relative', overflow: 'auto', width: '100%', height: 530
                    }
                  }
                >
                */
