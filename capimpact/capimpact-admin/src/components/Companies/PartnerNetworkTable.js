import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import ShowMoreText from 'react-show-more-text';
import { useQuery } from 'react-fetching-library';

import { getCompanyPartnerNetworksAction } from 'api/actions';

import { Table } from 'components/Table';

export default ({ company }) => {
  const queryResponse = useQuery(getCompanyPartnerNetworksAction({ cid: company.cid }));
  let { loading, payload: data = [] } = queryResponse;

  return (
    <React.Fragment>
      <Table
        height={675}
        loading={loading}
        data={data}
        totalRecords={data.length}
        initialVariables={{ pageSize: 25 }}
        remote={false}
        columns={[
          {
            Header: 'Actions',
            accessor: 'cid',
            width: 100,
            Cell: ({ value: cid }) => {
              return (
                <div>
                  {cid && (
                    <Button
                      key="tag-caps"
                      tag={Link}
                      color="link"
                      title="Tag Caps"
                      to={`/companies/${company.id}/partner-network/${cid}/tag-caps`}
                    >
                      <i className="fa fa-tags" />
                    </Button>
                  )}
                </div>
              );
            },
          },
          {
            Header: 'CID',
            accessor: 'cid',
          },
          {
            Header: 'Name',
            accessor: 'name',
            width: 150,
          },
          /*
              {
                Header: 'Label',
                accessor: 'label',
                width: 150,
              },
              */
          {
            Header: 'Capabilities',
            accessor: 'capabilities',
            width: 250,
            Cell: ({ value: capabilities }) => {
              return Array.from(capabilities || [])
                .map(cap => {
                  const [, name] = String(cap).split(':', 2);
                  return name;
                })
                .join(', ');
            },
          },
          {
            Header: 'Industry',
            accessor: 'industry',
            width: 150,
          },
          {
            Header: 'Type',
            accessor: 'type',
            width: 150,
          },
          {
            Header: 'Sector',
            accessor: 'sector',
            width: 150,
          },
          /*
              {
                Header: 'Comp Sets',
                accessor: 'comp_sets',
                width: 150,
              },
              */
          {
            Header: 'Description',
            accessor: 'description',
            width: 500,
            Cell: ({ value: description }) => (
              <ShowMoreText lines={2}>{description || ''}</ShowMoreText>
            ),
          },
        ]}
      />
    </React.Fragment>
  );
};
