/** @format */

import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import withStateHandlers from 'recompose/withStateHandlers';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import { useQuery } from 'react-fetching-library';
import Table from 'react-table-6';
import checkboxHOC from 'react-table-6/lib/hoc/selectTable';
import { CustomInput, Button } from 'reactstrap';

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

const CheckboxTable = checkboxHOC(Table);

const SelectInputComponent = ({ id, checked: value, onClick, row }) => {
  return (
    <CustomInput
      type="radio"
      id={id}
      checked={typeof value === 'boolean' ? value : value === row.id}
      onClick={event => {
        event.stopPropagation();
        onClick(id, event.shiftKey, row);
      }}
      onChange={() => {}}
      color="primary"
    />
  );
};

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
  /* table selection state */
  selection,
  selectAll,
  isSelected,
  toggleSelection,
  toggleAll,
  /* table actions */
  actions = [],
  onDeleteAll,
  setQueryResponse,
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
    <CheckboxTable
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
      selectType="radio"
      isSelected={isSelected}
      toggleSelection={toggleSelection}
      SelectInputComponent={SelectInputComponent}
      selectWidth={65}
      /* Controlled State Overrides */
      {...controlledProps}
      {...rest}
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
            <div className={classes.btnToolbar}>
              {onDeleteAll && (
                <Button
                  color="primary"
                  disabled={selection.length === 0}
                  onClick={() => onDeleteAll(selection)}
                >
                  Delete All Selected
                </Button>
              )}
            </div>
            <div className={classes.btnToolbar}>{actions}</div>
          </div>
          <div className="ReactTable-Wrapper">{makeTable()}</div>
        </div>
      )}
    </CheckboxTable>
  );
};

const enhance = compose(
  withStateHandlers(
    ({ initialVariables }) => ({
      pageSize: 10,
      page: 0,
      sorted: [{ id: 'createdAt', desc: true }],
      filtered: [],
      selection: null,
      ...initialVariables,
    }),
    {
      setPage: () => page => ({ page }),
      setPageSize: () => pageSize => ({ pageSize }),
      setSorted: () => sorted => ({ sorted }),
      setFiltered: () => filtered => ({ filtered }),
      toggleSelection: (state, { onSelect }) => (key, v, row) => {
        // Fix react table bug
        // https://github.com/tannerlinsley/react-table/issues/1243#issuecomment-459835765
        key = String(key).replace('select-', '');
        let selection = key;
        if (onSelect) {
          onSelect(selection, row);
        }
        return { selection };
      },
    }
  ),
  withProps(({ page, pageSize, sorted, filtered, variables = {} }) => ({
    variables: {
      limit: pageSize,
      skip: page * pageSize,
      sort: Array.from(sorted || []).map(sort => [sort.id, sort.desc ? '-1' : '1'])[0],
      ...Array.from(filtered || []).reduce((o, { id, value }) => ({ ...o, [id]: value }), {}),
      ...variables,
    },
  })),
  withHandlers({
    isSelected: ({ selection }) => key => {
      return String(selection) === String(key);
    },
  })
);

export default enhance(DataTable);
