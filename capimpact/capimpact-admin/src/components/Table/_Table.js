import React from 'react';
//import { useQuery } from 'react-fetching-library';
import { useTable, usePagination, useSortBy } from 'react-table';

import Spinner from 'components/Spinner';
import Pagination from './Pagination';

const TableComponent = ({
  columns,
  data = [],
  fetchData,
  loading,
  pageCount: controlledPageCount = 1000,
  //action: actionObject = [],
}) => {
  console.log('TableComponent:rerender');
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      //initialState: { pageIndex: 0 },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
      //getRowId: row => row.id,
    },
    useSortBy,
    usePagination
  );

  const paginationProps = {
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageIndex,
    pageSize,
  };

  // Now we can get our table state from the hoisted table state tuple

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    console.log('useEffect:fetchData', { pageIndex, pageSize });
    fetchData({
      skip: pageSize * pageIndex,
      limit: pageSize,
    });
  }, [pageIndex, pageSize, fetchData]);

  //console.log(pageIndex, pageSize);

  /*
  const [action, params] = actionObject;
  const { loading, payload, query: refetch } = useQuery(
    action({
      ...params,
      skip: 0, // pageIndex * pageSize
      limit: 500, // (pageIndex + 1) * pageSize
    })
  );
  */

  return (
    <React.Fragment>
      <table className="table table-bordered" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.canSort && (
                    <i
                      className={`fas fa-chevron-${
                        // isSortedDesc 'true' on descending sort, 'false' on ascending
                        column.isSortedDesc ? 'down' : 'up'
                      }`}
                    ></i>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
          {loading && <Spinner />}
        </tbody>
      </table>
      <Pagination {...paginationProps} />
    </React.Fragment>
  );
};

export default TableComponent;
