/** @format */

import React from 'react';
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

const SelectInputComponent = ({ id, checked, onClick, row }) => {
  return (
    <CustomInput
      type="checkbox"
      id={id}
      checked={checked}
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
  ...rest
}) => {
  //const [action] = actionObj;
  const { loading, payload: data = [] } = useQuery(action(variables));
  const pages = Math.ceil(totalRecords / pageSize);

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
      selectType="checkbox"
      selectAll={selectAll}
      isSelected={isSelected}
      toggleSelection={toggleSelection}
      toggleAll={() => toggleAll(data)}
      SelectInputComponent={SelectInputComponent}
      SelectAllInputComponent={SelectInputComponent}
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
      selectAll: false,
      selection: [],
      ...initialVariables,
    }),
    {
      setPage: () => page => ({ page }),
      setPageSize: () => pageSize => ({ pageSize }),
      setSorted: () => sorted => ({ sorted }),
      setFiltered: () => filtered => ({ filtered }),
      toggleAll: (state, { onSelect }) => data => {
        const selectAll = !state.selectAll;
        const selection = selectAll ? data.map(item => item.id) : [];
        if (onSelect) {
          onSelect(selection);
        }
        return { selectAll, selection };
      },
      toggleSelection: (state, { onSelect }) => key => {
        // Fix react table bug
        // https://github.com/tannerlinsley/react-table/issues/1243#issuecomment-459835765
        key = +String(key).replace('select-', '');
        let selection = [...state.selection];
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
          selection = [...selection.slice(0, keyIndex), ...selection.slice(keyIndex + 1)];
        } else {
          selection.push(key);
        }
        if (onSelect) {
          onSelect(selection);
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
    isSelected: ({ selection }) => key => selection.includes(key),
  })
);

export default enhance(DataTable);
