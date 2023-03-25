import React from 'react';
import { Pagination, PaginationItem, PaginationLink, Input } from 'reactstrap';

const PaginationComponent = ({
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
}) => (
  <div className="d-flex align-items-center justify-content-end mb-3">
    <Pagination className="mr-2">
      <PaginationItem disabled={!canPreviousPage}>
        <PaginationLink onClick={() => gotoPage(0)} first />
      </PaginationItem>
      <PaginationItem disabled={!canPreviousPage}>
        <PaginationLink onClick={() => previousPage()} previous />
      </PaginationItem>
      <span className="page-item d-flex align-items-center mx-2">
        Page{' '}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>{' '}
      </span>
      <PaginationItem disabled={!canNextPage}>
        <PaginationLink onClick={() => nextPage()} next />
      </PaginationItem>
      <PaginationItem disabled={!canNextPage}>
        <PaginationLink onClick={() => gotoPage(pageCount - 1)} last />
      </PaginationItem>
    </Pagination>
    <div>
      <Input
        type="select"
        value={pageSize}
        onChange={e => {
          setPageSize(Number(e.target.value));
        }}
      >
        {[10, 25, 50, 100].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </Input>
    </div>
  </div>
);

export default PaginationComponent;
