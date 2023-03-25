/** @format */

import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withProps from 'recompose/withProps';
import { useQuery } from 'react-fetching-library';
import Table from 'react-table-6';

import 'react-table-6/react-table.css';
import './react-table-material.css';

import classes from './CheckboxTable.module.css';

import {
  TableComponent,
  TbodyComponent,
  TheadComponent,
  TrComponent,
  TrGroupComponent,
  ThComponent,
  TdComponent,
} from './components';

const actionEmpty = () => ({
  method: 'GET',
  endpoint: '/',
});

const DataTable = ({
  data: dataLocal,
  /* query */
  action = actionEmpty,
  variables,
  /* table props */
  remote = true,
  /* table state */
  totalRecords = 1000,
  pageSize,
  page,
  sorted,
  filtered,
  setPage,
  setPageSize,
  setSorted,
  setFiltered,
  /* table actions */
  actions = [],
  onDeleteAll,
  setQueryResponse,
  /* table styles */
  height = 600,
  ...rest
}) => {
  //const [action] = actionObj;
  const queryResponse = useQuery(action(variables));
  let { loading, payload: data = [] } = queryResponse;
  let pages = Math.ceil(totalRecords / pageSize);

  let controlledProps = {};
  if (remote) {
    controlledProps = {
      manual: true,
      pages: pages || -1,
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
      onSortedChange: setSorted,
      onFilteredChange: setFiltered,
      page,
      pageSize,
      sorted,
      filtered,
    };
  } else {
    controlledProps = { data: dataLocal };
  }

  useEffect(() => {
    if (setQueryResponse) {
      setQueryResponse(queryResponse);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Table
      /* General */
      //className="-striped -highlight"
      data={Array.from(data || [])}
      loading={loading}
      showPaginationBottom
      pageSizeOptions={[5, 10, 20, 25, 50, 100, 250, 500, 1000]}
      sortable
      resizable
      //filterable
      /* Selection */
      keyField="id"
      /* Controlled State Overrides */
      {...controlledProps}
      {...rest}
      getTableProps={(...args) => {
        return {
          height,
        };
      }}
      TableComponent={TableComponent}
      TbodyComponent={TbodyComponent}
      TheadComponent={TheadComponent}
      TrComponent={TrComponent}
      TrGroupComponent={TrGroupComponent}
      ThComponent={ThComponent}
      TdComponent={TdComponent}
    >
      {(state, makeTable) => (
        <div>
          <div className={classes.btnToolbar}>
            <div className={classes.btnToolbar}></div>
            <div className={classes.btnToolbar}>{actions}</div>
          </div>
          <div className="ReactTable-Wrapper">{makeTable()}</div>
        </div>
      )}
    </Table>
  );
};

const enhance = compose(
  withStateHandlers(
    ({ initialVariables }) => ({
      pageSize: 10,
      page: 0,
      sorted: [{ id: 'createdAt', desc: true }],
      filtered: [],
      ...initialVariables,
    }),
    {
      setPage: () => page => ({ page }),
      setPageSize: () => pageSize => ({ pageSize }),
      setSorted: () => sorted => ({ sorted }),
      setFiltered: () => filtered => ({ filtered }),
    }
  ),
  withProps(({ page, pageSize, sorted, filtered, variables = {} }) => ({
    variables: {
      limit: pageSize,
      skip: page * pageSize,
      sort: Array.from(sorted || []).map(sort => [sort.id, sort.desc ? 'DESC' : 'ASC'])[0],
      ...Array.from(filtered || []).reduce((o, { id, value }) => ({ ...o, [id]: value }), {}),
      ...variables,
    },
  }))
);

export default enhance(DataTable);
